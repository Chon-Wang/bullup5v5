var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');

var testCase = require('./testcase.js');
var logger = require('./util/logutil.js');
var feedbackProxy = require('./proxy/feedbackProxy.js');

var userInfo = null;
var teamInfo = null;

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
    }
});

socket.on('friendInvitation', function (invitePacket) {
    logger.listenerLog('friendInvitation');
    // TODO 获取邀请者信息, 选择是否接受邀请\
    logger.jsonLog(invitePacket);
});

testCase.testLogin(socket);

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


// testCase.testRegister(socket);