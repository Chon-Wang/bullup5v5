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
            var message = {};
            message.messageType = 'inviteBattle';
            message.team = challengerTeam;
            message.hostTeam = hostTeam;
            message.messageText = '对战请求';
            message.name = challengerTeam.captain.name;
            //向host team发送挑战队伍信息
            dstSocket.emit('message', message);
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
    socket.on('inviteBattleResult', function (feedback) {
        // 如果接受了邀请
        if (feedback.errorCode == 0) {
            // 向两方队伍中的所有人进行广播
            var challengerTeam = teamProxy.mapTeamNameToFormedTeam(feedback.extension.challengerTeam.roomName);
            var hostTeam = teamProxy.mapTeamNameToFormedTeam(feedback.extension.hostTeam.roomName);
            var currentTime = require('moment')().format('YYYYMMDDHHmmss');

            // 更新队伍状态
            teamProxy.changeTeamStatus(challengerTeam.name, 'INBATTLE');
            teamProxy.changeTeamStatus(hostTeam.name, 'INBATTLE');

            // 状态改变的队伍不再需要在对战大厅中显示，所以不再广播类表中
            teamProxy.removeBroadcastTeam(challengerTeam.name);
            teamProxy.removeBroadcastTeam(challengerTeam.name);

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
            
            exports.battles[battle.battleName] = battle;

            // 将挑战队伍的所有用户加入到新的socket room
            for (var i in challengerTeam.participants) {
                socketProxy.userJoin(challengerTeam.participants[i].userId, battle.battleName);
            }

            // 将受挑战队伍的所有用户加入到新的socket room
            for (var i in hostTeam.participants) {
                socketProxy.userJoin(hostTeam.participants[i].userId, battle.battleName);
            }

            // 向该对局中所有的用户广播对局信息
            io.sockets.in(battle.battleName).emit('battleInfo', battle);
            io.sockets.broadcast.in(battle.battleName).emit('battleInfo', battle);
            io.in(battle.battleName).emit('battleInfo', battle);
            // 向对局中所有用户广播要建立的lol房间信息
            io.sockets.in(battle.battleName).emit('lolRoomEstablish', {
                roomName: 'BULLUP' + (new Date).valueOf(),
                password: Math.floor(Math.random() * 1000), // 4位随机数
                creatorId: challengerTeam.captain
            });
            
        } else if (feedback.errorCode == 1) {

            var dstSocket = socketProxy.mapUserIdToSocket(feedback.extension.userId);

            dstSocket.emit('feedback', feedback);
        }
    })
}

/**
 * 处理lol房间创建完毕
 * @param io
 * @param socket
 */
exports.handleLOLRoomEstablished = function (io, socket) {
    socket.on('lolRoomEstablished', function (battleInfo) {
        io.sockets.in(battleInfo.battleName).emit('lolRoomEstablished');
    })
}

