var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');

var testCase = require('./testcase.js');
var logUtil = require('./util/logutil.js');
var feedbackProxy = require('./proxy/feedbackProxy.js');

var userInfo = null;

socket.on('feedback', function (feedback) {
    switch(feedback.type) {
        case 'LOGINRESULT':
            userInfo = feedbackProxy.handleLoginResult(feedback);
            break;

        case 'REGISTERRESULT':
            userInfo = feedbackProxy.handleRegisterResult(feedback);
            break;
        
        case 'ESTABLISHTEAMRESULT':
            
    }
    
    if (userInfo) {
        logUtil.jsonLog(userInfo);
    }
});

testCase.testLogin(socket);

// testCase.testRegister(socket);