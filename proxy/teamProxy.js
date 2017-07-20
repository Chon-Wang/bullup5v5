var logger = require('../util/logutil.js');

exports.init = function() {
    // 已经创建完毕的队伍
    this.formedTeams = {};
    // 正在创建中的队伍列表
    this.unformedTeams = {};
    // 用来进行广播的队伍列表
    this.broadcastTeamInfos = {};
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

/**
 * 处理用户确认创建队伍请求
 * @param io
 * @param socket
 */
exports.handleTeamForm = function (io, socket) {
    socket.on('teamForm', function (teamInfo) {
        logger.listenerLog('teamForm');

        teamInfo = exports.mapTeamNameToUnformedTeam(teamInfo.teamName);
        // 更新队伍信息状态
        teamInfo.status = 'PUBLISHING';
        // 将未形成队伍列表中的队伍放入已形成队伍列表中
        exports.formedTeams[teamInfo.name] = teamInfo;
        // 将该队伍可以用来广播的内容加入到广播列表中
        exports.broadcastTeamInfos[teamInfo.name] = {
            teamName: teamInfo.name,
            status: teamInfo.status,
            type: teamInfo.type,
            bet: teamInfo.bet,
            mapId: teamInfo.mapId,
            rule: teamInfo.rule,
            participantsCount: teamInfo.participants.length
        };
        exports.unformedTeams[teamInfo.name] = null;
        // 告诉该队伍中的所有用户队伍已经形成
        io.in(teamInfo.name).emit('teamForm');
    });
}

/**
 * 处理用户更新对战大厅房间请求
 * @param socket
 */
exports.handleVersusLobbyRefresh = function(socket) {
    socket.on('versusLobbyRefresh', function () {
        logger.listenerLog('versusLobbyRefresh');
        socket.emit('feedback', {
            errorCode: 0,
            type: 'VERSUSLOBBYINFO',
            text: '对战大厅更新数据',
            extension: exports.broadcastTeamInfos
        });
    });
}


/**
 * 处理用户查看详情
 * @param socket
 */
exports.handleTeamDetails = function (socket) {
    socket.on('teamDetails', function (teamInfo) {
        var team = exports.formedTeams[teamInfo.teamName];
        if (team.status == 'PUBLISHING') {
            socket.emit('feedback', {
                errorCode: 0,
                type: 'TEAMDETAILS',
                text: '队伍详情',
                extension: team,
            })
        } else {
            socket.emit('feedback', {
                errorCode: 1,
                type: 'TEAMDETAILS',
                text: '查看队伍详情失败, 请刷新对战大厅',
                extension: null
            })
        }
    })
}