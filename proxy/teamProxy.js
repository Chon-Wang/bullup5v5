
// 已经创建完毕的队伍
var formedTeams = {};
// 正在创建中的队伍列表
var unformedTeams = {};

var logger = require('../util/logutil.js');
/**
 * 队伍创建监听
 * @param socket
 */
exports.handleTeamEstablish = function(socket) {
    socket.on('teamEstablish', function (team) {
        logger.listenerLog('teamEstablish');
        formedTeams[team.name] = team;
        // 将该socket放入teamname命名的room中
        socket.join(team.name);

        // 返回回馈信息
        socket.emit('feedback', {
            errorCode: 0,
            type: 'ESTABLISHTEAMRESULT',
            text: '创建成功',
            extension: null
        });
    });
}

