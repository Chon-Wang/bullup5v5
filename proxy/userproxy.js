var dbUtil = require('../util/dbutil.js');
var logger = require('../util/logutil.js');
var socketProxy = require('./socketProxy.js');
var teamProxy = require('./teamProxy.js');
var async = require('async');

exports.init = function () {
    this.users = {};
}

/**
 * 向数据结构中添加用户
 */
exports.addUser = function (user) {
    this.users[user.userId] = user;
}

/**
 * 处理用户连接
 * @param socket
 */
exports.handleLogin = function (socket) {
    socket.on('login', function (data) {
        logger.listenerLog('login');

        dbUtil.findUserByAccount(data.userName, function (user) {
            if (!user || user.user_password != data.password) {
                // 登录失败
                socketProxy.stableSocketEmit(socket, 'feedback', {
                    errorCode: 1,
                    text: '登录失败，请检验用户名密码！',
                    type: 'LOGINRESULT',
                    extension: null
                });
            } else {
                // 登陆成功
                socketProxy.add(user.user_id, socket);
                async.waterfall([
                    function(callback){
                        dbUtil.findUserIconById(user.user_id, function(iconId){
                            var userInfo = {};
                            userInfo.userId = user.user_id;
                            userInfo.userNickname = user.user_nickname;
                            userInfo.userIconId = iconId.icon_id;
                            callback(null, userInfo);
                        });
                    },
                    function(userInfo, callback){
                        dbUtil.findFriendListByUserId(userInfo.userId, function (friendList) {
                            //定义一个空数组，用来保存根据状态排序后的信息
                            var arr = new Array();
                            for(obj in friendList){
                                arr.push(friendList[obj]);
                            }
                            arr.sort(function(x,y){
                                return x.online < y.online ? 1 : -1;
                            });
                            //console.log(arr);
                            userInfo.friendList = arr;
                            callback(null, userInfo);
                        });
                    },
                    function(userInfo, callback){
                        dbUtil.findStrengthInfoByUserId(userInfo.userId, function (strengthInfo) {
                            userInfo.strengthInfo = strengthInfo;
                            callback(null, userInfo);
                        });
                    },
                    function(userInfo, callback){
                        dbUtil.findUserWealthByUserId(userInfo.userId, function (wealthInfo) {
                            userInfo.wealth = wealthInfo.bullup_currency_amount;
                            callback(null, userInfo);
                        });
                    },
                    function(userInfo, callback){
                        dbUtil.findUserLOLAccountInfo(userInfo.userId, function(lolAccountInfo){
                            userInfo.lolAccountInfo = lolAccountInfo;
                            callback(null, userInfo);
                        });
                    },
                    //检查是否是第一次登录
                    function(userInfo,callback){
                        dbUtil.checkLastLoginTime(userInfo.userId,function(lastLoginTime){
                            userInfo.lastLoginTime = lastLoginTime;
                            callback(null,userInfo);
                        });
                    },
                    //查找用户约战次数
                    function(userInfo,callback){
                        dbUtil.findUserBattleCount(userInfo.userId,function(count){
                            userInfo.battleCount = count[0].battleCount;
                            //console.log(userInfo.battleCount);
                            callback(null,userInfo);
                        });
                    }

                ], function(err, userInfo){
                    var userStrength = userInfo.strengthInfo;
                    var feedback = {
                        errorCode: 0,
                        type: 'LOGINRESULT',
                        text: "登录成功",
                        extension: {
                            name: userInfo.userNickname,
                            userId: userInfo.userId,
                            //----------------------
                            userRole:user.user_role,
                            lastLoginTime:userInfo.lastLoginTime,
                            battleCount:userInfo.battleCount,
                            //----------------------
                            avatarId: userInfo.userIconId,
                            wealth: userInfo.wealth,
                            online: true,
                            status: 'IDLE',
                            friendList: userInfo.friendList,
                            lolAccountInfo: userInfo.lolAccountInfo,
                            relationMap: {
                                currentTeamId: null,
                                currentGameId: null
                            }
                        }
                    };
                    if(userStrength != undefined){
                        var kda = ((userStrength.bullup_strength_k + userStrength.bullup_strength_a) / (userStrength.bullup_strength_d + 1.2)).toFixed(1);
                        feedback.extension.strength = {
                            kda: kda,
                            averageGoldEarned: userStrength.bullup_strength_gold,
                            averageTurretsKilled: userStrength.bullup_strength_tower,
                            averageDamage: userStrength.bullup_strength_damage,
                            averageDamageTaken: userStrength.bullup_strength_damage_taken,
                            averageHeal: userStrength.bullup_strength_heal,
                            score: userStrength.bullup_strength_score
                        }
                    }else{
                        feedback.extension.strength = undefined;
                    }
                    exports.addUser(feedback.extension);

                    socketProxy.stableSocketEmit(socket, 'feedback', feedback);
                    //socketProxy.stableEmit();
                    //socket.emit('feedback', feedback);
                });
            }
        });
    });
}

/**
 * 处理用户注册
 * @param socket
 */
exports.handleRegister = function (socket) {
    socket.on('register', function (userInfo) {
        logger.listenerLog('register');
        dbUtil.findUserByAccount(userInfo.userAccount, function (user) {
            if (user) {
                // 如果该用户存在
                socketProxy.stableSocketEmit(socket, 'feedback', {
                    errorCode: 1,
                    text: '该用户已经注册',
                    type: 'REGISTERRESULT',
                    extension: null
                });
            } else {
                dbUtil.findUserByPhone(userInfo.userPhoneNumber, function (user) {
                    if(user){
                        socketProxy.stableSocketEmit(socket, 'feedback', {
                            errorCode: 1,
                            text: '该手机号已被使用',
                            type: 'REGISTERRESULT',
                            extension: null
                        });
                    }else{
                        dbUtil.findUserByNickname(userInfo.userNickname, function (user) {
                            if(user){
                                socketProxy.stableSocketEmit(socket, 'feedback', {
                                    errorCode: 1,
                                    text: '该昵称已被使用',
                                    type: 'REGISTERRESULT',
                                    extension: null
                                });
                            }else{
                                //dbUtil.findUserByCode(userInfo.userEmail, function (user) {
                                    // if(user){
                                    //     socketProxy.stableSocketEmit(socket, 'feedback', {
                                    //         errorCode: 1,
                                    //         text: '该邀请码已被使用',
                                    //         type: 'REGISTERRESULT',
                                    //         extension: null
                                    //     });
                                    // }else{
                                        dbUtil.addUser(userInfo, function (userAddRes) {
                                            socketProxy.stableSocketEmit(socket, 'feedback', {
                                                errorCode: 0,
                                                text: '注册成功',
                                                type: 'REGISTERRESULT',
                                                extension: {
                                                    userAccount: userInfo.userAccount,
                                                    userNickname: userInfo.userNickname,
                                                    userId: userAddRes.userId,
                                                    userIconId: 1,
                                                }
                                            });
                                        });
                                    //}
                                //});
                                
                            }
                        });
                    }
                });
            }
        });
    });
}

/**
 * 处理用户邀请好友
 * @param socket
 */
exports.handleInviteFriend = function (socket) {
    socket.on('message', function (inviteMessage) {
        logger.listenerLog('message');
        if (socketProxy.isUserOnline(inviteMessage.userId)) {
            var dstSocket = socketProxy.mapUserIdToSocket(inviteMessage.userId);
            inviteMessage.messageToken = 'message' + inviteMessage.userId + (new Date()).getTime();

            socketProxy.stableSocketEmit(dstSocket, 'message', inviteMessage);
        } else {
            socketProxy.stableSocketEmit(socket, 'feedback', {
                errorCode: 1,
                type: 'INVITERESULT',
                text: '邀请失败,该用户已经下线'
            });
        }
    });
}

exports.handleIconIdUpdate = function (socket) {
    socket.on('iconIdUpdate', function (iconData) {
        dbUtil.updateUserIconIdByUserId(iconData.userId, iconData.newIconId);
        socketProxy.stableSocketEmit(socket, 'feedback', {
            'errorCode': 0,
            'type': 'ICONUPDATERESULT',
            'text': '头像更新成功',
            'extension': null
        });
    });
}

//查询账户余额
exports.handleGetBalance = function (socket){
    socket.on('getBalance', function(data){
        //console.log('2134');
        dbUtil.getBalance(data,function(balance){
            var tempBalance = balance.bullup_currency_amount;
            socketProxy.stableSocketEmit(socket,'feedback', {
                errorCode: 0,
                text: '查询余额OK',
                type: 'GETBALANCERESULT',
                extension: {
                    "balance": tempBalance,
                }
            });
        });
     });
}

//用户更改信息
exports.handleUserUpdateInfo = function(socket){
    socket.on('updateInfo',function(data){
        console.log(data);
        dbUtil.updateUserInfo(data,function(res){
            if(!res){
                socketProxy.stableSocketEmit(socket,'feedback', {
                    errorCode: 1,
                    text: '修改失败,请稍后重试',
                    type: 'UPDATEINFORESULT',
                    extension: null
                });
            }else{
                socketProxy.stableSocketEmit(socket,'feedback', {
                    errorCode: 0,
                    text: '信息修改成功',
                    type: 'UPDATEINFORESULT',
                    extension: null
                });
            } 
        });
    })
}

//用户最近登陆时间
exports.handlelastLoginTime = function (socket){
    socket.on('loginTime', function(data){
        console.log(data);
        dbUtil.insertLastLoginTime(data,function(res){
            // var tempBalance = balance.bullup_currency_amount;
            // socket.emit('feedback', {
            //     errorCode: 0,
            //     text: '查询余额OK',
            //     type: 'GETBALANCERESULT',
            //     extension: {
            //         "balance": tempBalance,
            //     }
            // });
        });
     });
}

/**
 * 处理用户或拒绝对方用户的邀请
 * @param io 服务器io, 通过该io向某个房间的所有用户广播信息
 * @param socket 该用户的连接socket
 */
exports.handleUserInviteResult = function (io, socket) {
    socket.on('inviteResult', function (feedback) {
        logger.listenerLog('inviteResult');

        //用户接受邀请
        if (feedback.errorCode == 0) {
            //socket.emit('success', 'hello');
            var teamName = feedback.extension.teamName;
            var participant = feedback.extension.userInfo;

            // TODO 更新用户状态

            // 更新teamList中team信息, 添加该参与者
            teamProxy.addParticipantToTeam(teamName, participant);
            socketProxy.joinRoom(socket, teamName);
            //    socket.emit('teamInfoUpdate', teamProxy.mapTeamNameToUnformedTeam(teamName));

            // 向房间内的所有用户广播当前队伍信息
            socketProxy.stableSocketsEmit(io.sockets.in(teamName), teamName, 'teamInfoUpdate', teamProxy.mapTeamNameToUnformedTeam(teamName));
        } else if (feedback.errorCode == 1) {
            // 用户拒绝邀请
            var hostId = feedback.extension.hostId;

            // 向发起者发送拒绝信息
            var dstSocket = socketProxy.mapUserIdToSocket(hostId);
            socketProxy.stableSocketEmit(dstSocket, 'feedback', feedback);
        }
    });
}

exports.changeUserStatus = function (userId, status) {
    this.users[userId].status = status;
}

exports.handleRankRequest = function (socket){
    socket.on('rankRequest', function(request){
        var userId = socketProxy.mapSocketToUserId(socket.id);
        dbUtil.getStrengthScoreRank(userId,function(strengthRankList){
            dbUtil.getWealthRank(userId,function(wealthRankList){
                socketProxy.stableSocketEmit(socket, 'feedback', {
                    errorCode: 0,
                    text: '获取排名成功',
                    type: 'STRENGTHRANKRESULT',
                    extension: {
                        "strengthRankList": strengthRankList,
                        "wealthRankList": wealthRankList
                    }
                });
            });
        });
    });
}


exports.handleLOLBind = function(socket){
    socket.on('lolLoginResult',function(loginPacket){
        
        var userId = socketProxy.socketUserMap[socket.id];
        var lolAccount = loginPacket.accountId;
        var lolNickname = loginPacket.nickname;
        var lolArea = loginPacket.serverName;
        var lastRank = loginPacket.lastRank;
        var currentRank = loginPacket.currentRank;
        var oriScore = exports.originStrengthScoreCalculation(lastRank, currentRank);

        async.waterfall([
            function(callback){
                dbUtil.validateBindInfo(userId, lolAccount, lolArea, function(bindValidityResult){
                    //如果该用户在该大区已绑定了账号  或者该大区的账号已被绑定  则拒绝绑定
                    var feedback = {};
                    if(bindValidityResult.value != 'true'){
                        feedback.text = '绑定失败';
                        feedback.type = 'LOLBINDRESULT';
                        switch(bindValidityResult.errorCode){
                            case 1:{
                                feedback.errorCode = 1;
                                feedback.extension = {};
                                feedback.extension.tips = '该英雄联盟账号已被绑定';
                                break;
                            }
                            case 2:{
                                feedback.errorCode = 2;
                                feedback.extension = {};
                                feedback.extension.tips = '您在该区已经绑定了英雄联盟账号';
                                break;
                            }
                        }
                        callback('error', feedback);
                    }else{
                        callback(null, null);
                    }
                });   
            },
            function(blankData, callback){
                dbUtil.insertBindInfo(userId, lolAccount, lolNickname, lolArea, function(bindResult){
                    if(bindResult.errorCode == 0){
                        var feedback = {
                            errorCode: 0,
                            type: 'LOLBINDRESULT',
                            text: '绑定成功',
                            extension: {
                                tips: '绑定成功',
                                userId: userId,
                                lolNickname: lolNickname,
                                lolArea : lolArea,
                                lolAccount: lolAccount
                            }
                        };
                        callback(null, feedback);
                    }else{
                        var feedback = {
                            errorCode: 3,
                            type: 'LOLBINDRESULT',
                            text: '绑定失败',
                            extension: {
                                tips: '服务器异常，请稍后再试' 
                            }
                        }
                        callback(null, feedback);
                    }
                });
            }
        ],function(err,feedback){
            if(feedback.errorCode == 0){
                //更新用户战力表
                var bindInfo = feedback.extension;
                bindInfo.oriStrengthScore = oriScore;
                dbUtil.updateStrengthInfo(bindInfo, function(result){
                    console.log("result" + result);
                });
            }
            socketProxy.stableSocketEmit(socket, 'feedback', feedback);
        });
    });
}
/**个人中心 */
exports.handlePersonalCenterRequest = function(socket){
    socket.on('pesonalCenterRequest', function(request){
        console.log('result:'+JSON.stringify(request));
        //dbUtil.getPersonalCenterInfoByUserId();
        dbUtil.getPersonalCenterInfoByUserId(request.userId,function(queryResult){
            console.log("queryResult"+JSON.stringify(queryResult));
            var feedback = {};
            if(queryResult != null && queryResult != undefined){
                feedback.errorCode = 0,
                feedback.type = 'PESONALCENTERRESULT',
                feedback.text = '个人中心加载成功'
                var data = {};
                //填充data
                data.userId = queryResult.userInfo[0].user_id;
                console.log('id..'+queryResult.user_id);
                //data.XXX = queryResult.XXX;
                data.userAccount=queryResult.userInfo[0].user_account;
                data.name=queryResult.userInfo[0].user_nickname;
                data.payAccountId=queryResult.Id.bullup_payment_account_id;
                // data.paymentType=queryResult.paymentHistory.bullup_paymet_type;
                // data.paymentAccount=queryResult.paymentHistory.bullup_account;
                data.lolInfoId=queryResult.info[0].lol_info_id;
                data.UserlolAccount=queryResult.info[0].user_lol_account;
                data.UserlolNickname=queryResult.info[0].user_lol_nickname;
                data.UserlolArea=queryResult.info[0].user_lol_area;
                data.UserlolInfo_wins=queryResult.lolInfo_wins;
                data.UserlolInfo_k=queryResult.lolInfo_strength_k;
                data.UserlolInfo_d=queryResult.lolInfo_strength_d;
                data.UserlolInfo_a=queryResult.lolInfo_strength_a;
                data.UserlolInfo_minion=queryResult.lolInfo_strength_minion;
                data.UserlolInfo_gold=queryResult.lolInfo_strength_gold;
                data.UserlolInfo_tower=queryResult.lolInfo_strength_tower;
                data.UserlolInfo_damage=queryResult.lolInfo_strength_damage;
                data.UserInfo_damage_taken=queryResult.lolInfo_strength_damage_taken;
                data.UserInfo_gold_perminiute=queryResult.lolInfo_strength_gold_perminiute;
                data.UserInfo_heal=queryResult.lolInfo_strength_heal;
                data.UserStrengthRank=queryResult.strengthRank;
                data.UserWealthRank=queryResult.wealthRank;
                data.User_icon_id=queryResult.icon_id;
                data.UserWealth=queryResult.wealth;
                data.UserStrength=queryResult.lolInfo_strength_score;
                data.competition_wins=queryResult.competition_wins;
                feedback.extension = data;
              //  console.log('feedback:'+JSON.stringify(data));
            }else{
                feedback.errorCode = 1,
                feedback.type = 'PESONALCENTERRESULT',
                feedback.text = '个人中心加载失败',
                feedback.extension = null
            }
            socketProxy.stableSocketEmit(socket, 'feedback', feedback);
            console.log('feedback111:'+JSON.stringify(feedback));
        });
    });
}

exports.handleAddFriendRequest = function(socket){
    socket.on('addFriendRequest', function(request){
        var userInfo = request.userInfo;
        var invitedUserNickname = request.invitedUserNickname;
        var flag = false;
        for(var index in exports.users){
            if(exports.users[index].name == invitedUserNickname){
                //发送请求
                var invitedUserInfo = exports.users[index];
                var tarSocket = socketProxy.mapUserIdToSocket(invitedUserInfo.userId);
                socketProxy.stableSocketEmit(tarSocket, 'message', {
                    'userInfo':  userInfo,
                    'invitedUserInfo': invitedUserInfo,
                    'messageType': 'addFriend',
                    'messageText': '添加好友',
                    'messageToken': 'message' + userInfo.name + (new Date()).getTime()
                });
                flag = true;
                break;
            }
        }
        if(!flag){
            socketProxy.stableSocketEmit(socket, 'feedback', {
                'errorCode': 1,
                'text': '好友添加失败，对方不在线',
                'type': 'ADDFRIENDRESULT',
                'extension': null
            })
        }
    });
}

exports.handleAddFriendResult = function(socket){
    socket.on('addFriendResult', function(result){
        var userInfo = result.extension.userInfo;
        var invitedUserInfo = result.extension.invitedUserInfo;
        var socket1 = socketProxy.mapUserIdToSocket(userInfo.userId);
        if(result.errorCode == 0){
            var socket2 = socketProxy.mapUserIdToSocket(invitedUserInfo.userId);
            socketProxy.stableSocketEmit(socket1, 'feedback', {
                'errorCode': 0,
                'type': "ADDFRIENDRESULT",
                'text': invitedUserInfo.name + "同意了您的好友添加请求",
                'extension': {
                    'newFriend':  invitedUserInfo
                }
            });

            socketProxy.stableSocketEmit(socket2, 'feedback', {
                'errorCode': 0,
                'type': "ADDFRIENDRESULT",
                'text': "成功将" + userInfo.name + "添加为好友",
                'extension': {
                    'newFriend':  userInfo
                }
            });

            dbUtil.addFriendRelationship(userInfo.userId, invitedUserInfo.userId);
            
        }else{
            socketProxy.stableSocketEmit(socket1, 'feedback', {
                'errorCode': 1,
                'type': "ADDFRIENDRESULT",
                'text': invitedUserInfo.name + "拒绝了您的好友添加请求",
                'extension': null
            });
        }
    });
}


exports.originStrengthScoreCalculation = function(lastSesonRank, currentSeasonRank){
	switch(lastSesonRank){
		case 'UNRANKED': lastSesonRank = 1200; break;
		case 'BRONZE': lastSesonRank = 1050; break;
		case 'SILVER': lastSesonRank = 1300; break;
		case 'GOLD': lastSesonRank = 1550; break;
		case 'PLATINUM': lastSesonRank = 1850; break;
		case 'DIAMOND': lastSesonRank = 2200; break;
		case 'MASTER': lastSesonRank = 2350; break;
		case 'CHALLENGER': lastSesonRank = 2350; break;
		default : lastSesonRank = 1200; break;
	}
	
	switch(currentSeasonRank){
		case 'UNRANKED': currentSeasonRank = 1200; break;
		case 'BRONZE': currentSeasonRank = 1050; break;
		case 'SILVER': currentSeasonRank = 1300; break;
		case 'GOLD': currentSeasonRank = 1550; break;
		case 'PLATINUM': currentSeasonRank = 1850; break;
		case 'DIAMOND': currentSeasonRank = 2200; break;
		case 'MASTER': currentSeasonRank = 2350; break;
		case 'CHALLENGER': currentSeasonRank = 2350; break;
		default : currentSeasonRank = 1200; break;
	}
	return lastSesonRank * 0.6 + currentSeasonRank * 0.4;
}



exports.insertFeedbackMessage=function(socket){
    socket.on('feedbackMessage',function(result){
        console.log('result:'+JSON.stringify(result)); 
        logger.listenerLog('feedbackMessage');
        dbUtil.insertFeedback(result,function(res){
            if(!res){
                socketProxy.stableSocketEmit(socket, 'feedback',{
                //console.log('result:'+JSON.stringify(result)); 
                //logger.listenerLog('feedbackMessage');
                    errorCode:1,
                    text:'反馈失败,请稍后重试',
                    type:'FEEDBACKMESSAGE',
                    extension:null
                });
            }else{
                socketProxy.stableSocketEmit(socket, 'feedback',{
                    errorCode:0,
                    text:'反馈成功，请耐心等待处理',
                    type:'FEEDBACKMESSAGE',
                    extension:null
                });
            }
        });
    })
}

exports.insertFeedbackMessage=function(socket){
    socket.on('feedbackMessage',function(result){
        console.log('result:'+JSON.stringify(result)); 
        logger.listenerLog('feedbackMessage');
        dbUtil.insertFeedback(result,function(res){
            if(!res){
                socketProxy.stableSocketEmit(socket, 'feedback',{
                //console.log('result:'+JSON.stringify(result)); 
                //logger.listenerLog('feedbackMessage');
                    errorCode:1,
                    text:'反馈失败,请稍后重试',
                    type:'FEEDBACKMESSAGE',
                    extension:null
                });
            }else{
                socketProxy.stableSocketEmit(socket, 'feedback',{
                    errorCode:0,
                    text:'反馈成功，请耐心等待处理',
                    type:'FEEDBACKMESSAGE',
                    extension:null
                });
            }
        });
    })
}