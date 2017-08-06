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
        logger.levelMsgLog(1, feedback.text);
        return feedback.extension;
    } else {
        logger.levelMsgLog(1, feedback.text);

    }
}

exports.handleInvitation = function (feedback) {
    logger.methodLog('handleInvitation');

    if (feedback.errorCode == 0) {
        logger.levelMsgLog(1, feedback.text);
    }
    switch (feedback.errorCode) {
        case 1: // 服务器问题导致用户邀请失败
            logger.levelMsgLog(1, feedback.text);
            //TODO Do something
            break;

        case 2: // 受邀用户拒绝邀请
            logger.levelMsgLog(1, feedback.text);
            //TODO Do something
            break;
    }

}

exports.handleVersusLobbyInfo = function (feedback) {
    logger.methodLog('handleVersusLobbyInfo');

    if (feedback.errorCode == 0) {
        logger.levelMsgLog(1, feedback.text);
        return feedback.extension;
    } else {
        // TODO 处理失败逻辑
    }
}

exports.handleTeamDetails = function (feedback) {
    logger.methodLog('handleTeamDetails');

    if (feedback.errorCode == 0) {
        logger.levelMsgLog(1, feedback.text);
        return feedback.extension;
    } else {
        logger.levelMsgLog(1, feedback.text);
    }
}
