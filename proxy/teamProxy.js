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
exports.handleRoomEstablish = function(socket) {
    socket.on('roomEstablish', function (room) {
        logger.listenerLog('roomEstablish');
        logger.jsonLog(room);
        exports.unformedTeams[room.roomName] = room;
        // 将该socket放入teamname命名的room中
        socket.join(room.roomName);
        // 返回回馈信息
        socket.emit('feedback', {
            errorCode: 0,
            type: 'ESTABLISHROOMRESULT',
            text: '创建成功',
            extension: room
        });
    });
}


exports.handleRefreshFormedBattleRoom = function(socket){
    socket.on('refreshFormedBattleRoom', function(data){
        console.log('refresh command');
        var feedback = {
            errorCode: 0,
            type: 'REFRESHFORMEDBATTLEROOMRESULT',
            text: '刷新成功',
            extension: {
                formedTeams: exports.formedTeams
            }
        }
        socket.emit('feedback', feedback);
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
 * 根据队伍获取已经形成的队伍信息
 * @param teamName 队伍名
 */
exports.mapTeamNameToFormedTeam = function (teamName) {
    return this.formedTeams[teamName];
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
exports.handleTeamEstablish = function (io, socket) {
    socket.on('establishTeam', function (roomInfo) {
        logger.listenerLog('establishTeam');

        teamInfo = exports.mapTeamNameToUnformedTeam(roomInfo.roomName);
        // 更新队伍信息状态
        teamInfo.status = 'PUBLISHING';
        // 将未形成队伍列表中的队伍放入已形成队伍列表中
        exports.formedTeams[teamInfo.roomName] = teamInfo;
        // 将该队伍可以用来广播的内容加入到广播列表中
        //
        // exports.broadcastTeamInfos[teamInfo.roomName] = {
        //     teamName: teamInfo.roomName,
        //     status: teamInfo.status,
        //     type: teamInfo.gameMode,
        //     bet: teamInfo.rewardAmount,
        //     mapId: teamInfo.mapSelection,
        //     rule: teamInfo.winningCondition,
        //     participantsCount: teamInfo.participants.length
        // };
        delete exports.unformedTeams[teamInfo.roomName];
        var feedback = {
            errorCode: 0,
            type: 'ESTABLISHTEAMRESULT',
            text: '队伍创建成功',
            extension: {
                teamInfo: teamInfo,
                formedTeams: exports.formedTeams
            }
        };
        // 告诉该队伍中的所有用户队伍已经形成
        io.sockets.in(teamInfo.roomName).emit('feedback', feedback);
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
        
        if (team && team.status == 'PUBLISHING') {
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

/**
 * 改变队伍状态，只改变已形成的队伍，未形成的队伍的状态只有ESTABLISHING
 * @param teamName 需要改变状态的队伍名
 * @param status 新状态
 */
exports.changeTeamStatus = function (teamName, status) {
    this.formedTeams.status = status;
}

exports.removeBroadcastTeam = function (teamName) {
    this.broadcastTeamInfos[teamName] = null;
}