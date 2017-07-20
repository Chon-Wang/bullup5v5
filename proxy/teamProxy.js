var logger = require('../util/logutil.js');

exports.init = function() {
    // 已经创建完毕的队伍
    this.formedTeams = {};
    // 正在创建中的队伍列表
    this.unformedTeams = {};
}
/**
 * 队伍创建监听
 * @param socket
 */
exports.handleTeamEstablish = function(socket) {
    socket.on('teamEstablish', function (team) {
        logger.listenerLog('teamEstablish');
        logger.jsonLog(team);
        exports.unformedTeams[team.name] = team;
        // 将该socket放入teamname命名的room中
        socket.join(team.name);

        // 返回回馈信息
        socket.emit('feedback', {
            errorCode: 0,
            type: 'ESTABLISHTEAMRESULT',
            text: '创建成功',
            extension: team
        });
    });
}


/**
 * 通过队伍名获取未形成的队伍信息
 * @param teamName 队伍名
 */
exports.mapTeamNameToUnformedTeam = function (teamName) {
    return this.unformedTeams[teamName];
}

/**
 * 向未形成的队伍列表中的某一个team添加参与者
 * @param teamName 队伍名
 * @param participant 参与者信息
 */
exports.addParticipantToTeam = function (teamName, participant) {
    this.unformedTeams[teamName].participants.push(participant);
}
