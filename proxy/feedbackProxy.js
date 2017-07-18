var logUtil = require('../util/logutil.js');

exports.handleLoginResult = function (feedback) {
    logUtil.levelMsgLog(0, 'In handleLoginResult method:');
    if (feedback.errorCode == 0) {
        // 代表登陆成功
        return feedback.extension;
    } else {
        logUtil.levelMsgLog(1, feedback.text);
        return null;
    }
}

exports.handleRegisterResult = function (feedback) {
    logUtil.levelMsgLog(0, 'In handleRegisterResult method:');
    if (feedback.errorCode == 0) {
        return feedback.extension;
    } else {
        logUtil.levelMsgLog(1, feedback.text);
        return null;
    }
}