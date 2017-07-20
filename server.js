var io = require('socket.io')();
var logger = require('./util/logutil');

// 代理
var userProxy = require('./proxy/userproxy.js');
var teamProxy = require('./proxy/teamProxy.js');
var socketProxy = require('./proxy/socketproxy.js');

// 初始化Proxy, 所有需要保存数据结构的对象都需要初始化, 只能初始化一次
socketProxy.init();
teamProxy.init();


io.on('connection', function (socket) {
    logger.levelMsgLog(0, 'User ' + socket.id + ' connected!');

    userProxy.handleLogin(socket);

    userProxy.handleRegister(socket);

    userProxy.handleInviteFriend(socket);

    userProxy.handleUserInviteResult(io, socket);

    teamProxy.handleTeamEstablish(socket);


});

io.listen(3000);
