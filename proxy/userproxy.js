var dbUtil = require('../util/dbutil.js');
var logger = require('../util/logutil.js');
var socketProxy = require('./socketproxy.js');


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
                            text: null,
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
                socket.emit('registerResult', {
                    success: false,
                    text: '该用户已注册',
                    userId: -1
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

exports.handleInviteFriend = function (socket) {
    socket.on('inviteFriend', function (invitePackage) {
        logger.listenerLog('inviteFriend');
        if (socketProxy.isUserOnline(invitePackage.userId)) {
            var dstSocket = socketProxy.mapToSocket(invitePackage.userId);
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

