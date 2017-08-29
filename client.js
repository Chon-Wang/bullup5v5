var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');
/////
var testCase = require('./testcase.js');
var logger = require('./util/logutil.js');
var feedbackProxy = require('./proxy/feedbackProxy.js');