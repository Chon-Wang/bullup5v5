var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');
/////
var testCase = require('./testcase.js');
var logger = require('./util/logutil.js');
var feedbackProxy = require('./proxy/feedbackProxy.js');

var userInfo = null;
var teamInfo = null;
var inviteInfo = null;
var versusLobbyInfo = null;
var battleInfo = null;
//
//
socket.on('success', function (data) {
    logger.listenerLog('success');
    console.log(data);
})

socket.on('feedback', function (feedback) {
    switch (feedback.type) {
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
            versusLobbyInfo = feedbackProxy.handleVersusLobbyInfo(feedback);
            logger.jsonLog(versusLobbyInfo);
            break;

        case 'TEAMDETAILS':
            var teamDetails = feedbackProxy.handleTeamDetails(feedback);
            logger.jsonLog(teamDetails);
            break;

        case 'INVITEBATTLERESULT':
            // 这里应该有一个自己的处理函数但是目前处理方式相同所以暂时用这个
            feedbackProxy.handleInvitation(feedback);
            break;
    }
});

socket.on('friendInvitation', function (invitePacket) {
    logger.listenerLog('friendInvitation');
    // TODO 获取邀请者信息, 选择是否接受邀请
    inviteInfo = invitePacket;
    logger.jsonLog(inviteInfo);
});

// 监听服务端队伍信息更新
socket.on('teamInfoUpdate', function (data) {
    logger.listenerLog('teamInfoUpdate');
    logger.jsonLog(data);
    teamInfo = data;
});

socket.on('teamForm', function () {
    logger.listenerLog('teamForm');
    //TODO 切换到对战大厅
    socket.emit('versusLobbyRefresh');
});

socket.on('battleRequest', function (battleRequest) {
    logger.listenerLog('battleRequest');
    // TODO 提示用户有对战邀请, 点击查看对方详情
    logger.jsonLog(battleRequest);
});

socket.on('battleInfo', function (battle) {
    logger.listenerLog('battleInfo');
    battleInfo = battle;
    logger.jsonLog(battleInfo);
});

socket.on('lolRoomEstablish', function (lolRoom) {
    logger.listenerLog('lolRoomEstablish');
    if (userInfo.userId == lolRoom.creatorId) {
        // 如果用户是创建者，则创建房间
    } else {
        // 如果不是创建者，则显示等待蓝方队长建立房间
        logger.jsonLog(lolRoom);
    }
});

socket.on('lolRoomEstablished', function () {
    logger.listenerLog('lolRoomEstablished');
    logger.levelMsgLog(1, '进入游戏，开始游戏');
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

// setTimeout(
//     function () {
//         testCase.testInviteFriend(socket, userInfo, 'colinyoung', teamInfo);
//     },
//     2000
// );

// setTimeout(
//     function () {
//         testCase.testRecvInvitation(socket, userInfo, inviteInfo);
//     },
//     3000
// );

setTimeout(
    function () {
        testCase.testFormTeam(socket, userInfo, teamInfo);
    },
    2000
);

setTimeout(
    function () {
        testCase.testTeamDetails(socket, {
            teamName: teamInfo.name,
            userId: userInfo.userId
        })
    },
    3000
);

setTimeout(
    function () {
        testCase.testBattleInvite(socket, {
            challengerTeamName: teamInfo.name,
            hostTeamName: teamInfo.name,
            userId: userInfo.userId
        })
    },
    4000
)

setTimeout(
    function () {
        testCase.testRecvBattleInvite(socket, {
            errorCode: 0,
            type: 'INVITEBATTLERESULT',
            text: teamInfo.name + '队拒绝了邀请',
            extension: {
                // Just for test---------------
                challengerTeamName: teamInfo.name,
                hostTeamName: teamInfo.name,
                userId: userInfo.userId
                // Just for test---------------
            }
        })
    },
    5000
);

setTimeout(
    function () {
        socket.emit('lolRoomEstablished', {
            battleName: battleInfo.battleName
        })
    },
    6000
)

var public=null;
var publi1c=1;
// testCase.testRegister(socket);
