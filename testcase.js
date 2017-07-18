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



