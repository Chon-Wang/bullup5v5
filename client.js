var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');

var testCase = require('./testcase.js');
var logger = require('./util/logutil.js');
var feedbackProxy = require('./proxy/feedbackProxy.js');

var userInfo = null;
var teamInfo = null;
var inviteInfo = null;
var versusInfo = null;

socket.on('success', function (data) {
    logger.listenerLog('success');
    console.log(data);
})

socket.on('feedback', function (feedback) {
    switch(feedback.type) {
        case 'LOGINRESULT':
            userInfo = feedbackProxy.handleLoginResult(feedback);
            //----------------为了测试---------------------
            // 为了用户可以邀请自己便于测试
            userInfo.friendList[userInfo.name] = {
                name: userInfo.name,
                userId: userInfo.userId,
                avatarId: userInfo.avatarId,
                online: userInfo.online,
                status: userInfo.status
            }
            //--------------------------------------------
            logger.jsonLog(userInfo);
            break;

        case 'REGISTERRESULT':
            userInfo = feedbackProxy.handleRegisterResult(feedback);
            logger.jsonLog(userInfo);
            break;
        
        case 'ESTABLISHTEAMRESULT':
            teamInfo = feedbackProxy.handleTeamEstablishResult(feedback);
            logger.jsonLog(teamInfo);
            break;
        
        case 'INVITERESULT':
            feedbackProxy.handleInvitation(feedback);
            break;

        case 'VERSUSLOBBYINFO':
            versusInfo = feedbackProxy.handleVersusLobbyInfo(feedback);
            logger.jsonLog(versusInfo);
            break;
    }
});

socket.on('friendInvitation', function (invitePacket) {
    logger.listenerLog('friendInvitation');
    // TODO 获取邀请者信息, 选择是否接受邀请
    logger.jsonLog(invitePacket);
    inviteInfo = invitePacket;
});

// 监听服务端队伍信息更新
socket.on('teamInfoUpdate', function(data) {
    logger.listenerLog('teamInfoUpdate');
    logger.jsonLog(data);
    teamInfo = data;
});

socket.on('teamForm', function() {
    logger.listenerLog('teamForm');
    //TODO 切换到对战大厅
    socket.emit('versusLobbyRefresh');
});

testCase.testLogin(socket, {
    userName: 'colinyoung',
    password: '123456'
});

setTimeout(
    function () {
        testCase.testEstablishTeam(socket, userInfo);
    }, 1000
);

setTimeout(
    function () {
        testCase.testInviteFriend(socket, userInfo, 'colinyoung', teamInfo);
    },
    2000
);

setTimeout(
    function () {
        testCase.testRecvInvitation(socket, userInfo, inviteInfo);
    },
    3000
);

setTimeout(
    function () {
        testCase.testFormTeam(socket, userInfo, teamInfo);
    },
    4000
)

// testCase.testRegister(socket);