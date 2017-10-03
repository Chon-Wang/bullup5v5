var logger = require('../util/logutil');
var socketProxy = require('./socketproxy.js');
var dbUtil = require('../util/dbutil.js');


exports.init = function () {
    this.applyInfo = {};
}
/**
 *创建赛事信息
 */
exports.handlematchInfo = function (socket) {
    socket.on('matchInfo', function (matchInfo) {
        logger.listenerLog('matchInfo');
        dbUtil.insertMatchInfo(matchInfo, function (res) {
            if (!res) {
                socket.emit('feedback', {
                    errorCode: 1,
                    text: '修改失败，请稍后重试',
                    type: 'MATCHRESULT',
                    extension: null
                });
            } else {
                socket.emit('feedback', {
                    errorCode: 0,
                    text: '修改成功',
                    type: 'MATCHRESULT',
                    extension: {
                        //userAccount: userInfo.userAccount,
                        //userNickname: userInfo.userNickname,
                        //userId: userAddRes.userId,
                        //userIconId: 1,
                       
                    }
                });
            }
        });
    });
}
/**
 * 报名监听
 */
exports.handleapplyMatch = function (socket) {
    socket.on('signup', function (apply) {
        logger.listenerLog('applyMatch');
        // console.log(apply.userId);
        dbUtil.insertJoinCompetition(apply, function (res) {
            if (!res) {
                socket.emit('feedback', {
                    errorCode: 1,
                    text: '修改失败，请稍后重试',
                    type: 'APPLYRESULT',
                    extension: null
                });
            } else {
                socket.emit('feedback', {
                    errorCode: 0,
                    text: '修改成功',
                    type: 'APPLYRESULT',
                    extension: {
                    }
                });
            }
        });
    })

}

/**
 * 查看所有赛事
 * status=0 等待报名中
 * status=1 比赛中
 * status=2 报名中
 * status=3 等待比赛中
 * status=4 比赛结束
 */
exports.handlecheckMatchInfo = function (socket) {
    socket.on('checkmatch', function (match) {
         logger.listenerLog('checkmatch');
        // console.log('match:' + JSON.stringify(match));
        console.log(match.userId);
        dbUtil.getMatchInfo(match, function (res) {
            // console.log('match:' + JSON.stringify(res));
            if (!res) {
                socket.emit('feedback', {
                    errorCode: 1,
                    text: '查询失败，请稍后重试',
                    type: 'MATCHRESULT',
                    extension: null
                });
            } else {
                socket.emit('feedback', {
                    errorCode: 0,
                    text: '查询成功',
                    type: 'MATCHRESULT',
                    extension: {
                        data:res
                        
                    }
                });
            }
        });
    });
}
/**
 * 获取我发起的所有赛事
 * 
 */
exports.handleInitiateCompetition = function (socket) {
    socket.on('initiate', function (initiate) {
         logger.listenerLog('initiate');
        // console.log(initiate.userId);
        dbUtil.getInitiateCompetition(initiate, function (initiateResult) {
            // console.log(initiateResult);
            //   console.log('initiateResult:'+JSON.stringify(initiateResult));
                 var feedback = {};
            if (initiateResult != null && initiateResult != undefined) {
                feedback.errorCode = 0,
                    feedback.type = 'INITATERESULT',
                    feedback.text = '已获取我发起赛事的所有信息'
                    feedback.extension = initiateResult
            } else {
                feedback.errorCode = 1,
                    feedback.type = 'INITATERESULT',
                    feedback.text = '获取我发起的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
            //  console.log('1111111'+feedback);
        })
        
    })

}
/**
 * 获取参与的所有赛事
 */
exports.handleJoinCompetition = function (socket) {
    socket.on('joinMatch', function (joinMatch) {
         
        dbUtil.getJoinCompetition(joinMatch, function (joinMatchResult) {
        // console.log(joinMatchResult);
        //    console.log('joinMatchResult:'+JSON.stringify(joinMatchResult));
            var feedback = {};
            if (joinMatchResult != null && joinMatchResult != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'JOINRESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = joinMatchResult;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'JOINRESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })
    })
}

/**
 * 报名中详情
 */
exports.handleApplyInfo = function (socket){
    socket.on('apply',function(applyInfo){
        logger.listenerLog('apply');
        dbUtil.getApplyInfo(applyInfo, function (applyInfoResult) {
        // console.log(applyInfoResult);
           console.log('joinMatchResult:'+JSON.stringify(applyInfoResult));
            var feedback = {};
            if (applyInfoResult != null && applyInfoResult != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'APPLYRESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = applyInfoResult;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'APPLYRESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })
    })
}
/**
 * 等待报名详情
 */
exports.handleAwaitApplyInfo = function (socket){
    socket.on('await',function(awaitApplyInfo){
        logger.listenerLog('await');
        dbUtil.getApplyInfo(awaitApplyInfo, function (awaitApplyResult) {
        // console.log(awaitApplyResult);
        //    console.log('awaitApplyResult:'+JSON.stringify(awaitApplyResult));
            var feedback = {};
            if (awaitApplyResult != null && awaitApplyResult != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'AWAITAPPLYRESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = awaitApplyResult;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'AWAITAPPLYRESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })
    })
}
/**
 * 等待比赛详情
 */
exports.handleAwayGame = function (socket){
    socket.on('awaygame',function(awayGameInfo){
        logger.listenerLog('awaygame');
        dbUtil.getApplyInfo(awayGameInfo, function (awayGameResult) {
        // console.log(awayGameResult);
        //    console.log('awayGameResult:'+JSON.stringify(awayGameResult));
            var feedback = {};
            if (awayGameResult != null && awayGameResult != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'AWAYGAMERESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = awayGameResult;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'AWAYGAMERESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })
    })
}
/**
 * 比赛进行中详情
 */
exports.handleUnderway = function (socket){
    socket.on('underway',function(underWayInfo){
        logger.listenerLog('underway');
        dbUtil.getApplyInfo(underWayInfo, function (underWayResult) {
        // console.log(underWayResult);
        //    console.log('underWayResult:'+JSON.stringify(underWayResult));
            var feedback = {};
            if (underWayResult != null && underWayResult != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'UNDERWAYRESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = underWayResult;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'UNDERWAYRESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })
    })
}

/**
 * 比赛结束详情
 */
exports.handleFinishGame = function (socket){
    socket.on('finish',function(finishInfo){
        logger.listenerLog('finish');
        dbUtil.getApplyInfo(finishInfo, function (finishResult) {
        // console.log(finishResult);
        //    console.log('finishResult:'+JSON.stringify(finishResult));
            var feedback = {};
            if (finishResult != null && finishResult != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'FINISHRESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = finishResult;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'FINISHRESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })
    })
}


/**
 * 报名审核详情
 */
exports.handleauditApply = function (socket){
    socket.on('checksign',function(auditInfo){
        logger.listenerLog('audit');
        // console.log(auditInfo.competitionid);
        dbUtil.getauditApplyInfo(auditInfo, function (auditInfo) {
        // console.log(finishResult);
           console.log('auditInfo:'+JSON.stringify(auditInfo));
            var feedback = {};
            if (auditInfo != null && auditInfo != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'AUDITRESULT',
                    feedback.text = '已获取我参与赛事的所有信息'
                    feedback.extension = auditInfo;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'AUDITRESULT',
                    feedback.text = '获取我参与的赛事失败',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        });

    });

}

/**
 * 报名通过审核详情
 */
exports.handleagreeApply = function (socket){
    socket.on('agreeApply',function(agreeApply){
        logger.listenerLog('agreeApply');
        // console.log(agreeApply.matchid)
        dbUtil.updateagreeCompetition(agreeApply, function (agreeApply) {
        // console.log(finishResult);
        //    console.log('auditInfo:'+JSON.stringify(auditInfo));
            var feedback = {};
            if (agreeApply != null && agreeApply != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'AUDITRESULT',
                    feedback.text = '已通过审核'
                    feedback.extension = null;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'AUDITRESULT',
                    feedback.text = '未通过',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })


    });

}
/**
 * 报名通过审核详情
 */
exports.handlerejectApply = function (socket){
    socket.on('rejectApply',function(rejectApply){
        logger.listenerLog('rejectApply');
        // console.log(rejectApply.matchid)
        dbUtil.updaterejectCompetition(rejectApply, function (rejectApply) {
        // console.log(finishResult);
        //    console.log('auditInfo:'+JSON.stringify(auditInfo));
            var feedback = {};
            if (rejectApply != null && rejectApply != undefined) {
                    feedback.errorCode = 0,
                    feedback.type = 'AUDITRESULT',
                    feedback.text = '审核成功'
                    feedback.extension = null;
            } else {
                    feedback.errorCode = 1,
                    feedback.type = 'AUDITRESULT',
                    feedback.text = '审核未通过',
                    feedback.extension = null
            }
            socket.emit('feedback', feedback);
        })


    });

}
