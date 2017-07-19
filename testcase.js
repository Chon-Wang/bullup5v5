exports.testLogin = function (socket) {
    socket.emit('login', {
        userName: 'colinyoung',
        password: '123456'
    });
}

exports.testRegister = function (socket) {
    socket.emit('register', {
        userName: 'colinyoung2',
        tel: '18553358649',
        email: '1427714873@qq.com',
        password: '123456'
    });
}

exports.testEstablishTeam = function (socket, userInfo) {
    socket.emit('teamEstablish', {
        name: userInfo.name + (new Date).valueOf(),
        captian: {
            name: userInfo                                                                                                                                                                       .name,
            userId: userInfo.userId,
        },
        participants: [
            {
                name: userInfo.name,
                userId: userInfo.userId,
                avatarId: userInfo.avatarId,
                strength: userInfo.strength
            }
        ],
        status: 'ESTABLISHING',
        type: 'BATTLE',
        bet: 100,
        mapId: 1,
        rule: '基地爆炸'
    })
}

exports.testInviteFriend = function (socket, userInfo, friendName, teamInfo) {
    var friend = userInfo.friendList[friendName];

    socket.emit('inviteFriend', {
        name: friend.name,
        userId: friend.userId,
        host: {
            name: userInfo.name,
            userId: userInfo.userId,
        },
        team: {
            name: teamInfo.name,
            bet: teamInfo.bet, // 赌注
            mapId: teamInfo.mapId,
            rule: teamInfo.rule
        }
    });
}