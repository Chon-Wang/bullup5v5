var dbUtil = require('../util/dbutil.js');
var logger = require('../util/logutil.js');
var socketProxy = require('./socketproxy.js');
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
                socket.emit('feedback', {
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
                            userInfo.friendList = friendList;
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
                            avatarId: userInfo.userIconId,
                            wealth: userInfo.wealth,
                            online: true,
                            status: 'IDLE',
                            friendList: userInfo.friendList,
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
                    socket.emit('feedback', feedback);
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
                socket.emit('feedback', {
                    errorCode: 1,
                    text: '该用户已经注册',
                    type: 'REGISTERRESULT',
                    extension: null
                });
            } else {
                dbUtil.addUser(userInfo, function (userAddRes) {
                    socket.emit('feedback', {
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
        console.log('invite : ' + inviteMessage);
        logger.listenerLog('message');
        if (socketProxy.isUserOnline(inviteMessage.userId)) {
            var dstSocket = socketProxy.mapUserIdToSocket(inviteMessage.userId);
            dstSocket.emit('message', inviteMessage);
        } else {
            socket.emit('feedback', {
                errorCode: 1,
                type: 'INVITERESULT',
                text: inviteMessage.userName + '邀请失败,该用户已经下线'
            });
        }
    })
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
            socket.join(teamName);
            //    socket.emit('teamInfoUpdate', teamProxy.mapTeamNameToUnformedTeam(teamName));

            // 向房间内的所有用户广播当前队伍信息
            io.sockets.in(teamName).emit('teamInfoUpdate', teamProxy.mapTeamNameToUnformedTeam(teamName));
        } else if (feedback.errorCode == 1) {
            // 用户拒绝邀请
            var hostId = feedback.extension.hostId;

            // 向发起者发送拒绝信息
            var dstSocket = socketProxy.mapUserIdToSocket(hostId);
            dstSocket.emit('feedback', feedback);
        }
    });
}

exports.changeUserStatus = function (userId, status) {
    this.users[userId].status = status;
}

exports.handleRankRequest = function (socket){
    socket.on('rankRequest', function(request){
        var userId = socketProxy.mapUserIdToSocket(socket.id);
        dbUtil.getStrengthScoreRank(userId,function(strengthRankList){
            dbUtil.getWealthRank(userId,function(wealthRankList){
                 socket.emit('feedback', {
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
    socket.on('lolBindRequest',function(request){
        var userId = request.userId;
        var lolAccount = request.lolAccount;
        var lolNickname = request.lolNickname;
        var lolArea = request.lolArea;
        async.waterfall([
            function(callback){
                console.log(userId);
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
                                lolArea : lolArea
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
                dbUtil.addStrengthInfo(bindInfo, function(result){
                    console.log("result" + result);
                });
            }
            socket.emit('feedback', feedback);
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
                data.paymentType=queryResult.paymentHistory.bullup_paymet_type;
                data.paymentAccount=queryResult.paymentHistory.bullup_account;
                data.lolInfoId=queryResult.info[0].lol_info_id;
                data.UserlolAccount=queryResult.info[0].user_lol_account;
                data.UserlolNickname=queryResult.info[0].user_lol_nickname;
                data.UserlolArea=queryResult.info[0].user_lol_area;
                
                
                feedback.extension = data;
              //  console.log('feedback:'+JSON.stringify(data));
            }else{
                feedback.errorCode = 1,
                feedback.type = 'PESONALCENTERRESULT',
                feedback.text = '个人中心加载失败',
                feedback.extension = null
            }
            socket.emit('feedback', feedback);
            console.log('feedback111:'+JSON.stringify(feedback));

        });
    });

}
