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

exports.handleBattleInviteResult = function (io, socket) {
    socket.on('battleInviteResult', function (feedback) {
        // 如果接受了邀请
        if (feedback.errorCode == 0) {
            // 向两方队伍中的所有人进行广播
            var challengerTeam = teamProxy.mapTeamNameToFormedTeam(feedback.extension.challengerTeamName);
            var hostTeam = teamProxy.mapTeamNameToFormedTeam(feedback.extension.hostTeamName);
            var currentTime = require('moment')().format('YYYYMMDDHHmmss');

            var battle = {
                battleName: challengerTeam.captain.name + hostTeam.captain.name + (new Date).valueOf(),
                blueSide: challengerTeam,
                redSide: hostTeam,
                status: 'unready',
                time: {
                    unready: currentTime,
                    ready: null,
                    start: null
                }
            };

            // 将对战信息放入数据结构
            exports.battles[battle.battleName] = battle;

            // 将挑战队伍的所有用户加入到新的socket room
            for (var i in challengerTeam.participants) {
                socketProxy.userJoin(challengerTeam.participants[i].userId, battle.battleName);
            }

            // 将受挑战队伍的所有用户加入到新的socket room
            for (var i in hostTeam.participants) {
                socketProxy.userJoin(hostTeam.participants[i].userId, battle.battleName);
            }

            io.sockets.in(battle.battleName).emit('battleInfo', battle);

        } else if (feedback.errorCode == 1) {

            var dstSocket = socketProxy.mapUserIdToSocket(feedback.extension.userId);

            dstSocket.emit('feedback', feedback)
        }
    })
}