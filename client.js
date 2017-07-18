var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');

var testCase = require('./testcase.js');
var logUtil = require('./util/logutil.js');
var feedbackProxy = require('./proxy/feedbackProxy.js');

var userInfo = null;
var teamInfo = null;

socket.on('feedback', function (feedback) {
    switch(feedback.type) {
        case 'LOGINRESULT':
            userInfo = feedbackProxy.handleLoginResult(feedback);
            logUtil.jsonLog(userInfo);
            break;

        case 'REGISTERRESULT':
            userInfo = feedbackProxy.handleRegisterResult(feedback);
            logUtil.jsonLog(userInfo);
            break;
        
        case 'ESTABLISHTEAMRESULT':
            teamInfo = feedbackProxy.handleTeamEstablishResult(feedback);
            logUtil.jsonLog(teamInfo);
            break;
        
        case 'INVITERESULT':
            feedbackProxy.handleInvitation(feedback);
            break;
    }
});


testCase.testLogin(socket);

setTimeout(
    function () {
        testCase.testEstablishTeam(socket, userInfo);
    }, 1000);



// testCase.testRegister(socket);