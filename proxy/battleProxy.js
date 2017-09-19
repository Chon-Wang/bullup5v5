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
            socketProxy.stableSocketEmit(dstSocket, 'message', message);
        } else {
            //失败向发出请求的用户返回失败信息
            socketProxy.stableSocketEmit(socket, 'feeback', {
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
            teamProxy.changeTeamStatus(challengerTeam.roomName, 'INBATTLE');
            teamProxy.changeTeamStatus(hostTeam.roomName, 'INBATTLE');

            // 状态改变的队伍不再需要在对战大厅中显示，所以不再广播类表中
            teamProxy.removeBroadcastTeam(challengerTeam.roomName);
            teamProxy.removeBroadcastTeam(hostTeam.roomName);

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

            teamProxy.printfAllTeamsInfo();
            // 向该对局中所有的用户广播对局信息
            
            socketProxy.stableSocketsEmit(io.sockets.in(battle.battleName), 'battleInfo', battle);

            //io.in(battle.battleName).emit('battleInfo', battle);
            // 向对局中所有用户广播要建立的lol房间信息
            console.log("创建者");
            console.log(challengerTeam.captain);

            socketProxy.stableSocketsEmit(io.sockets.in(battle.battleName), 'lolRoomEstablish', {
                roomName: 'BULLUP' + String((new Date).valueOf()).substr(6),
                password: Math.floor(Math.random() * 1000), // 4位随机数
                creatorId: challengerTeam.captain.userId
            });
            
        } else if (feedback.errorCode == 1) {

            var dstSocket = socketProxy.mapUserIdToSocket(feedback.extension.userId);

            socketProxy.stableSocketEmit(dstSocket, 'feedback', feedback);
        }
    });
}

/**
 * 处理lol房间创建完毕
 * @param io
 * @param socket
 */
exports.handleLOLRoomEstablished = function (io, socket) {
    socket.on('lolRoomEstablished', function (roomPacket) {
        //检查数据包中的人员是否能对应上

        //通知客户端游戏已开始
        for(var battleIndex in  exports.battles){
            var battle = exports.battles[battleIndex];
            if(battle.status == 'unready'){
                var myTeam = roomPacket.myTeam;
                var theirTeam = roomPacket.theirTeam;
                var blueSide = battle.blueSide;
                var redSide = battle.redSide;
                var teamFlag = true;
                if(myTeam[0].team == 1){
                    //看我方 蓝队人员配置是否合法
                    for(var bullupPaticipantIndex in blueSide.participants){
                        var bullupPaticipant = blueSide.participants[bullupPaticipantIndex];
                        var memberExsistFlag = false;
                        var lolAccountId = bullupPaticipant.lolAccountInfo.user_lol_account;
                        for(var lolPaticipantIndex in myTeam){
                            var lolPaticipant = myTeam[lolPaticipantIndex];
                            if(lolPaticipant.summonerId == lolAccountId){
                                memberExsistFlag = true;
                                break;
                            }
                        }
                        if(!memberExsistFlag){
                            teamFlag = false;
                            break;
                        }
                    }
                    //看敌方 红队人员配置是否合法
                    if(teamFlag){
                        for(var bullupPaticipantIndex in redSide.participants){
                            var bullupPaticipant = redSide.participants[bullupPaticipantIndex];
                            var memberExsistFlag = false;
                            var lolAccountId = bullupPaticipant.lolAccountInfo.user_lol_account;
                            for(var lolPaticipantIndex in theirTeam){
                                var lolPaticipant = theirTeam[lolPaticipantIndex];
                                if(lolPaticipant.summonerId == lolAccountId || lolPaticipant.summonerId=='0'){
                                    memberExsistFlag = true;
                                    break;
                                }
                            }
                            if(!memberExsistFlag){
                                teamFlag = false;
                                break;
                            }
                        }
                    }
                }else{
                    //看敌方 蓝队人员配置是否合法
                    for(var bullupPaticipantIndex in blueSide.participants){
                        var bullupPaticipant = blueSide.participants[bullupPaticipantIndex];
                        var memberExsistFlag = false;
                        var lolAccountId = bullupPaticipant.lolAccountInfo.user_lol_account;
                        for(var lolPaticipantIndex in theirTeam){
                            var lolPaticipant = theirTeam[lolPaticipantIndex];
                            if(lolPaticipant.summonerId == lolAccountId || lolPaticipant.summonerId=='0'){
                                memberExsistFlag = true;
                                break;
                            }
                        }
                        if(!memberExsistFlag){
                            teamFlag = false;
                            break;
                        }
                    }
                    //看我方 红队人员配置是否合法
                    if(teamFlag){
                        for(var bullupPaticipantIndex in redSide.participants){
                            var bullupPaticipant = redSide.participants[bullupPaticipantIndex];
                            var memberExsistFlag = false;
                            var lolAccountId = bullupPaticipant.lolAccountInfo.user_lol_account;
                            for(var lolPaticipantIndex in myTeam){
                                var lolPaticipant = myTeam[lolPaticipantIndex];
                                if(lolPaticipant.summonerId == lolAccountId){
                                    memberExsistFlag = true;
                                    break;
                                }
                            }
                            if(!memberExsistFlag){
                                teamFlag = false;
                                break;
                            }
                        }
                    }
                }
                if(teamFlag){
                    if(battle.status == 'unready'){
                        battle.status = 'ready';
                    }
                    socketProxy.stableSocketsEmit(io.sockets.in(battle.battleName), 'lolRoomEstablished', {});
                    break;
                }
            }
        }
    });
}

exports.handleBattleResult = function (io, socket){
    socket.on('lolBattleResult', function (lolResultPacket) {
        if(true){
        //if(lolResultPacket.head == 'result' && lolResultPacket.gameMode == 'CLASSIC' && lolResultPacket.gameType == 'CUSTOM_GAME'){
            if(lolResultPacket.win == 'yes'){
                //寻找该玩家所在的队伍
                var userLOLAccountId = lolResultPacket.accountId;
                var userId = socketProxy.mapSocketToUserId(socket.id);
                var winTeam = {};
                var loseTeam = {};
                var finishedBattle = {};
                var battles = exports.battles;
                for(var battleIndex in battles){
                    var battle = battles[battleIndex];

                    var blueSide = battle.blueSide;
                    var blueSidePaticipants = blueSide.participants;
                    var redSide = battle.redSide;
                    var redSidePaticipants = redSide.participants;

                    for(var bluePaticipantIndex in blueSidePaticipants){
                        var bluePaticipant = blueSidePaticipants[bluePaticipantIndex];
                        if(bluePaticipant.userId == userId){
                            winTeam = blueSidePaticipants;
                            loseTeam = redSidePaticipants;
                            finishedBattle = battle;
                            delete teamProxy.formedTeams[blueSide.roomName];
                            delete teamProxy.formedTeams[redSide.roomName];
                            delete exports.battles[battleIndex];
                            break;
                        }
                    }
                    for(var redPaticipantIndex in redSidePaticipants){
                        var redPaticipant = redSidePaticipants[redPaticipantIndex];
                        if(redPaticipant.userId == userId){
                            winTeam = redSidePaticipants;
                            loseTeam = blueSidePaticipants;
                            finishedBattle = battle;
                            delete teamProxy.formedTeams[blueSide.roomName];
                            delete teamProxy.formedTeams[redSide.roomName];
                            delete exports.battles[battleIndex];
                            break;
                        }
                    }

                    if(winTeam[0] != undefined){
                        break;
                    }
                }
                //管理服务端的全局变量 队伍和对局

                //组织通知双方队伍胜负结果的数据包

                var resultPacket = {};
                resultPacket.rewardType = finishedBattle.blueSide.rewardType;
                resultPacket.rewardAmount = finishedBattle.blueSide.rewardAmount;
                resultPacket.roomName = finishedBattle.blueSide.roomName;
                resultPacket.winTeam = winTeam;
                resultPacket.loseTeam = loseTeam;
            
                //广播结果数据包
                socketProxy.stableSocketsEmit(io.sockets.in(finishedBattle.battleName), 'battleResult', resultPacket);
                console.log(finishedBattle.battleName + "结束");
                //对局中所有的socket离开所有的socketRoom
                //io.sockets.in(finishedBattle.battleName).leaveAll();
            }
        }
    });
}

