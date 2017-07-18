var logger = require('../util/logUtil.js');

exports.handleLoginResult = function (feedback) {
    logger.methodLog('handleLoginResult');
    if (feedback.errorCode == 0) {
        // 代表登陆成功
        return feedback.extension;
    } else {
        logger.levelMsgLog(1, feedback.text);
        return null;
    }
}

exports.handleRegisterResult = function (feedback) {
    logger.methodLog('handleRegisterResult');
    if (feedback.errorCode == 0) {
        return feedback.extension;
    } else {
        logger.levelMsgLog(1, feedback.text);
        return null;
    }
}

exports.handleTeamEstablishResult = function (feedback) {
    logger.methodLog('handleTeamEstablishResult');
    if (feedback.errorCode == 0) {
        //TODO 展示在页面上
        console.log(feedback.text);
    } else {
        logger.levelMsgLog(1, feedback.text);
        return null;
    }
}