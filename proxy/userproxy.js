var dbUtil = require('../util/dbutil.js');
var logger = require('../util/logutil.js');
var socketProxy = require('./socketproxy.js');
var teamProxy = require('./teamProxy.js');

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
        dbUtil.findUserByNick(data.userName, function (user) {
            if (!user || user.password != data.password) {
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
                // 先通过用户id找到角色
                dbUtil.findRoleInfoByUserId(user.user_id, function (role) {
                    dbUtil.findFriendListByUserId(user.user_id, function (friendList) {
                        var feedback = {
                            errorCode: 0,
                            type: 'LOGINRESULT',
                            text: "登陆成功",
                            extension: {
                                name: user.nick_name,
                                userId: user.user_id,
                                avatarId: user.icon,
                                strength: {
                                    growth: role.growth,
                                    kda: role.kda,
                                    averageGoldEarned: role.average_gold_earned,
                                    averageTurretsKilled: role.average_turrets_killed,
                                    averageLiving: role.average_living,
                                    averageDamageTaken: role.average_damage_taken
                                },
                                wealth: user.credit_worthiness,
                                online: true,
                                status: 'IDLE',
                                friendList: friendList,
                                relationMap: {
                                    currentTeamId: null,
                                    currentGameId: null
                                }
                            }
                        };
                        exports.addUser(feedback.extension);
                        socket.emit('feedback', feedback);
                    });
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
        dbUtil.findUserByNick(userInfo.userName, function (user) {
            if (user) {
                // 如果该用户存在
                socket.emit('feedback', {
                    errorCode: 1,
                    text: '该用户已经注册',
                    type: 'REGISTERRESULT',
                    extension: null
                });
            } else {
                dbUtil.addUser(userInfo, function (userId) {

                    socket.emit('feedback', {
                        errorCode: 0,
                        text: '注册成功',
                        type: 'REGISTERRESULT',
                        extension: {
                            name: userInfo.userName,
                            userId: userId,
                            avatarId: 1,
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
    socket.on('inviteFriend', function (invitePackage) {
        logger.listenerLog('inviteFriend');
        if (socketProxy.isUserOnline(invitePackage.userId)) {
            var dstSocket = socketProxy.mapUserIdToSocket(invitePackage.userId);
            dstSocket.emit('friendInvitation', invitePackage);
        } else {
            socket.emit('feedback', {
                errorCode: 1,
                type: 'INVITERESULT',
                text: invitePackage.userName + '邀请失败'
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
            io.in(teamName).emit('teamInfoUpdate', teamProxy.mapTeamNameToUnformedTeam(teamName));
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
