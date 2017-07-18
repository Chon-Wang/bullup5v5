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
        name: (new Date).valueOf(),
        captian: {
            name: userInfo.name,
            userId: userInfo.userId,
        },
        participants: [
            {
                name: userInfo.name,
                userId: userInfo.userId,
                avatarId: userInfo.avatarId,
                strength: userInfo.strength
            }
        ]
    })
}



