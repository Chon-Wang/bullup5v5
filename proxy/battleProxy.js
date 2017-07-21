var teamProxy = require('./teamProxy.js');
var socketProxy = require('./socketproxy.js');

exports.init = function () {
    this.battles = {};
}

/**
 * 处理用户约战请求
 * @param socket
 */
exports.handleBattleInvite = function (socket) {
    socket.on('battleInvite', function (battelRequest) {
        var hostTeam = teamProxy.mapTeamNameToFormedTeam(battelRequest.hostTeamName);

        // 队伍不存在说明已经形成对局
        if (hostTeam && hostTeam.status == 'PUBLISHING') {
            var challengerTeam = teamProxy.mapTeamNameToFormedTeam(battelRequest.challengerTeamName);
            var captainId = hostTeam.captain.userId;
            //获取对战请求中host team的socket
            var dstSocket = socketProxy.mapUserIdToSocket(captainId);

            //向host team发送挑战队伍信息
            dstSocket.emit('battleRequest', challengerTeam);
        } else {
            //失败向发出请求的用户返回失败信息
            socket.emti('feeback', {
                errorCode: 1,
                type: 'BATTLEINVITERESULT',
                text: '邀请对战失败, 请刷新对战大厅',
                extension: null
            })
        }
    });
}