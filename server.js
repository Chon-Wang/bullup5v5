var io = require('socket.io')();
var logger = require('./util/logutil');

// 代理
var userProxy = require('./proxy/userproxy.js');

io.on('connection', function (socket) {
    logger.levelMsgLog(0, 'User ' + socket.id + ' connected!');

    userProxy.handleLogin(socket);

    userProxy.handleRegister(socket);

    
});

io.listen(3000);
