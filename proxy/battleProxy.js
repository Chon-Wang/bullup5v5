var teamProxy = require('./teamProxy.js');
var socketProxy = require('./socketProxy.js');
var logUtil = require('../util/logutil.js');
var dbUtil = require('../util/dbutil.js');

var matchLevel1MinCount = 2;
var matchLevel2MinCount = 2;
var matchLevel3MinCount = 2;


exports.init = function () {
    this.battles = {};
}

/**
 * 处理用户约战请求
 * @param socket
 */
exports.handleBattleInvite = function (socket) {
    socket.on('battleInvite', function (battelRequest) {
        console.log(teamProxy.formedTeams);
        //logUtil.logToFile("./logs/data/data.txt", "append", JSON.parse(teamProxy.formedTeams), "battleInviteResult teamProxy.formedTeams");

        var hostTeam = teamProxy.mapTeamNameToFormedTeam(battelRequest.hostTeamName);
        //写日志

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
            message.messageToken = 'message' + message.name + (new Date()).getTime();

            socketProxy.stableSocketEmit(dstSocket, 'message', message);
            //socketProxy.stableEmit();
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
        // 如果接受了邀
        logUtil.logToFile("./logs/data/data.txt", "append", "", "inviteBattleResult");

        if (feedback.errorCode == 0) {
            // 向两方队伍中的所有人进行广播
            var challengerTeam = teamProxy.mapTeamNameToFormedTeam(feedback.extension.challengerTeam.roomName);
            var hostTeam = teamProxy.mapTeamNameToFormedTeam(feedback.extension.hostTeam.roomName);

            logUtil.logToFile("./logs/data/data.txt", "append", JSON.stringify(challengerTeam), "inviteBattleResult challengeTeam");
            logUtil.logToFile("./logs/data/data.txt", "append", JSON.stringify(hostTeam), "inviteBattleResult hostTeam");

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
            //teamProxy.printfAllTeamsInfo();
            // 向该对局中所有的用户广播对局信息
            socketProxy.stableSocketsEmit(io.in(battle.battleName), battle.battleName, 'battleInfo', battle);
            socketProxy.stableSocketsEmit(io.sockets, battle.battleName, 'lolRoomEstablish', {
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
        logUtil.logToFile("./logs/data/data.txt", "append", JSON.stringify(roomPacket), "lolRoomEstablished roomPacket");
        logUtil.logToFile("./logs/data/data.txt", "append", JSON.stringify(exports.battles), "lolRoomEstablished battles");
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
                    socketProxy.stableSocketsEmit(io.sockets.in(battle.battleName), battle.battleName, 'lolRoomEstablished', {});
                    break;
                }
            }
        }
    });
}

exports.handleBattleResult = function (io, socket){
    socket.on('lolBattleResult', function (lolResultPacket) {

        logUtil.logToFile("./logs/data/data.txt", "append", JSON.stringify(lolResultPacket), "lolBattleResult lolResultPacket");
        console.log(io.sockets);

        if(true){
        //if(lolResultPacket.head == 'result' && lolResultPacket.gameMode == 'CLASSIC' && lolResultPacket.gameType == 'CUSTOM_GAME'){
            if(lolResultPacket.win == 'yes'){
                //寻找该玩家所在的队伍
                var userLOLAccountId = lolResultPacket.accountId;
                var userId = socketProxy.mapSocketToUserId(socket.id);
                var winTeam = {};
                var loseTeam = {};
                var finishedBattle = null;
                var battles = exports.battles;
                var winTeamStrengthScore = 0;
                var loseTeamStrengthScore = 0;

                var blueWin = true;

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
                            winTeamStrengthScore = blueSide.teamStrengthScore;
                            loseTeamStrengthScore = redSide.teamStrengthScore;

                            finishedBattle = battle;
                            delete teamProxy.formedTeams[blueSide.roomName];
                            delete teamProxy.formedTeams[redSide.roomName];
                            delete exports.battles[battleIndex];
                            break;
                        }
                    }
                    if(finishedBattle == null){
                        for(var redPaticipantIndex in redSidePaticipants){
                            var redPaticipant = redSidePaticipants[redPaticipantIndex];
                            if(redPaticipant.userId == userId){
                                winTeam = redSidePaticipants;
                                loseTeam = blueSidePaticipants;
                                winTeamStrengthScore = redSide.teamStrengthScore;
                                loseTeamStrengthScore = blueSide.teamStrengthScore;
                                blueWin = false;
                                finishedBattle = battle;
                                delete teamProxy.formedTeams[blueSide.roomName];
                                delete teamProxy.formedTeams[redSide.roomName];
                                delete exports.battles[battleIndex];
                                break;
                            }
                        }
                    }
                    if(winTeam[0] != undefined){
                        break;
                    }
                }
                //管理服务端的全局变量 队伍和对局
                //组织通知双方队伍胜负结果的数据包
                if(finishedBattle == null || finishedBattle.blueSide == undefined){
                    return;
                }
                finishedBattle.blueWin = blueWin;
                finishedBattle.redWin = !blueWin;

                var resultPacket = {};
                resultPacket.rewardType = finishedBattle.blueSide.rewardType;
                resultPacket.rewardAmount = finishedBattle.blueSide.rewardAmount;
                resultPacket.roomName = finishedBattle.blueSide.roomName;
                resultPacket.winTeam = winTeam;
                resultPacket.loseTeam = loseTeam;
                resultPacket.participants = lolResultPacket.participants;
                //算战力变化
                var newScore = exports.strengthScoreChangedCalculation(winTeamStrengthScore, loseTeamStrengthScore);
                var winScoreUpdateValue = newScore.newWinnerScore - winTeamStrengthScore;
                var loseScoreUpdateValue = newScore.newLoserScore - loseTeamStrengthScore;
                //扣钱
                for(var index in winTeam){
                    var player = winTeam[index];
                    dbUtil.updateStrengthAndWealth(player.userId, player.strength.score + winScoreUpdateValue, resultPacket.rewardAmount);
                }
                for(var index in loseTeam){
                    var player = loseTeam[index];
                    dbUtil.updateStrengthAndWealth(player.userId, player.strength.score + loseScoreUpdateValue, -1 * resultPacket.rewardAmount);
                }
                //写记录
                // dbUtil.writeBattleRecord(finishedBattle);

                //广播结果数据包
                socketProxy.stableSocketsEmit(io.sockets.in(finishedBattle.battleName), finishedBattle.battleName, 'battleResult', resultPacket);
                console.log(finishedBattle.battleName + "结束");
                console.log("");
                //对局中所有的socket离开所有的socketRoom
                //io.sockets.in(finishedBattle.battleName).leaveAll();
            }else if(lolResultPacket.win == 'no'){
                var userLOLAccountId = lolResultPacket.accountId;
                var userId = socketProxy.mapSocketToUserId(socket.id);
                var winTeam = {};
                var loseTeam = {};
                var finishedBattle = null;
                var battles = exports.battles;
                var winTeamStrengthScore = 0;
                var loseTeamStrengthScore = 0;

                var blueWin = true;

                for(var battleIndex in battles){
                    var battle = battles[battleIndex];
                    var blueSide = battle.blueSide;
                    var blueSidePaticipants = blueSide.participants;
                    var redSide = battle.redSide;
                    var redSidePaticipants = redSide.participants;
                    for(var bluePaticipantIndex in blueSidePaticipants){
                        var bluePaticipant = blueSidePaticipants[bluePaticipantIndex];
                        if(bluePaticipant.userId == userId){
                            loseTeam = blueSidePaticipants;
                            winTeam = redSidePaticipants;
                            loseTeamStrengthScore = blueSide.teamStrengthScore;
                            winTeamStrengthScore = redSide.teamStrengthScore;
                            blueWin = false;
                            finishedBattle = battle;
                            delete teamProxy.formedTeams[blueSide.roomName];
                            delete teamProxy.formedTeams[redSide.roomName];
                            delete exports.battles[battleIndex];
                            break;
                        }
                    }
                    if(finishedBattle == null){
                        for(var redPaticipantIndex in redSidePaticipants){
                            var redPaticipant = redSidePaticipants[redPaticipantIndex];
                            if(redPaticipant.userId == userId){
                                loseTeam = redSidePaticipants;
                                winTeam = blueSidePaticipants;
                                loseTeamStrengthScore = redSide.teamStrengthScore;
                                winTeamStrengthScore = blueSide.teamStrengthScore;

                                finishedBattle = battle;
                                delete teamProxy.formedTeams[blueSide.roomName];
                                delete teamProxy.formedTeams[redSide.roomName];
                                delete exports.battles[battleIndex];
                                break;
                            }
                        }
                    }
                    if(winTeam[0] != undefined){
                        break;
                    }
                }
                //管理服务端的全局变量 队伍和对局
                //组织通知双方队伍胜负结果的数据包
                if(finishedBattle == null || finishedBattle.blueSide == undefined){
                    return;
                }
                finishedBattle.blueWin = blueWin;
                finishedBattle.redWin = !blueWin;

                var resultPacket = {};
                resultPacket.rewardType = finishedBattle.blueSide.rewardType;
                resultPacket.rewardAmount = finishedBattle.blueSide.rewardAmount;
                resultPacket.roomName = finishedBattle.blueSide.roomName;
                resultPacket.winTeam = winTeam;
                resultPacket.loseTeam = loseTeam;
                resultPacket.participants = lolResultPacket.participants
                //算战力变化
                var newScore = exports.strengthScoreChangedCalculation(winTeamStrengthScore, loseTeamStrengthScore);
                var winScoreUpdateValue = newScore.newWinnerScore - winTeamStrengthScore;
                var loseScoreUpdateValue = newScore.newLoserScore - loseTeamStrengthScore;
                //扣钱
                for(var index in winTeam){
                    var player = winTeam[index];
                    dbUtil.updateStrengthAndWealth(player.userId, player.strength.score + winScoreUpdateValue, resultPacket.rewardAmount);
                }
                for(var index in loseTeam){
                    var player = loseTeam[index];
                    dbUtil.updateStrengthAndWealth(player.userId, player.strength.score + loseScoreUpdateValue, -1 * resultPacket.rewardAmount);
                }
                //写记录
                // dbUtil.writeBattleRecord(finishedBattle);
                
                //广播结果数据包
                socketProxy.stableSocketsEmit(io.sockets.in(finishedBattle.battleName), finishedBattle.battleName, 'battleResult', resultPacket);
                console.log(finishedBattle.battleName + "结束");
                console.log("");
                //对局中所有的socket离开所有的socketRoom
                //io.sockets.in(finishedBattle.battleName).leaveAll();

            }
        }
    });
}

exports.matchScheduling = function(matchPool){
    //console.log("------------scheduling-------------");
    for(var index in matchPool){
        if(matchPool[index].queue.length == 0){
            matchPool[index].delay = 0;
            continue;
        }
        if(matchPool[index].delay < 10){
            //一级调度
            matchSchedulingLevel1(matchPool, index);
        }else if(matchPool[index].delay >= 10 && matchPool[index].delay < 30){
            //二级调度
            matchSchedulingLevel2(matchPool, index);
        }else{
            //三级调度
            matchSchedulingLevel3(matchPool, index);
        }
        matchPool[index].delay++;
    }
}

function matchSchedulingLevel1(matchPool, poolIndex){
    
    if(matchPool[poolIndex].queue.length >= matchLevel1MinCount){
        console.log("lv1 match");
        var queues = [];
        var queuesIndex = [];
        queues.push(matchPool[poolIndex].queue);
        queuesIndex.push(poolIndex);
        var matchList = excuteMatch(queues);

        var queueNum1 = matchList.firstTeam.queueNum;
        var teamNum1 = matchList.firstTeam.teamNum;
        var firstTeam = matchPool[queuesIndex[queueNum1]].queue[teamNum1];

        var queueNum2 = matchList.secondTeam.queueNum;
        var teamNum2 = matchList.secondTeam.teamNum;
        var secondTeam = matchPool[queuesIndex[queueNum2]].queue[teamNum2];

        if(firstTeam == undefined || secondTeam == undefined){
            return;
        }

        if(queueNum1 == queueNum2){
            delete matchPool[queuesIndex[queueNum1]].queue[teamNum1];
            if(teamNum1 < teamNum2){
                delete matchPool[queuesIndex[queueNum1]].queue[teamNum2-1];
            }else{
                delete matchPool[queuesIndex[queueNum1]].queue[teamNum2];
            }
            matchPool[queuesIndex[queueNum1]].queue.length -= 2;
        }else{
            delete matchPool[queuesIndex[queueNum1]].queue[teamNum1];
            matchPool[queuesIndex[queueNum1]].queue.length -= 1;
            delete matchPool[queuesIndex[queueNum2]].queue[teamNum2];
            matchPool[queuesIndex[queueNum2]].queue.length -= 1;
        }

        broadCastMatchResult(firstTeam, secondTeam);
        matchPool[poolIndex].delay -= 2;
        if(matchPool[poolIndex].delay < 0){
            matchPool[poolIndex].delay = 0;
        }
    }
}

function matchSchedulingLevel2(matchPool, poolIndex){
    var indexes = [];
    if(parseInt(poolIndex) >= 4300){
        //前找2个
        indexes.push(String(poolIndex));
        indexes.push(String(parseInt(poolIndex) - 50));
        indexes.push(String(parseInt(poolIndex) - 100));
    }else{
        //后找2个
        indexes.push(String(poolIndex));
        indexes.push(String(parseInt(poolIndex) + 50));
        indexes.push(String(parseInt(poolIndex) + 100));
    }

    var queues = [];
    var queuesIndex = [];
    var count = 0;
    for(var index in indexes){
        queues.push(matchPool[indexes[index]].queue);
        queuesIndex.push(indexes[index]);
        count += matchPool[indexes[index]].queue.length;
    }
    if(count >= matchLevel2MinCount){
        var matchList = excuteMatch(queues);
        var queueNum1 = matchList.firstTeam.queueNum;
        var teamNum1 = matchList.firstTeam.teamNum;
        var firstTeam = matchPool[queuesIndex[queueNum1]].queue[teamNum1];
        var queueNum2 = matchList.secondTeam.queueNum;
        var teamNum2 = matchList.secondTeam.teamNum;
        var secondTeam = matchPool[queuesIndex[queueNum2]].queue[teamNum2];

        if(firstTeam == undefined || secondTeam == undefined){
            return;
        }

        if(queueNum1 == queueNum2){
            delete matchPool[queuesIndex[queueNum1]].queue[teamNum1];
            if(teamNum1 < teamNum2){
                delete matchPool[queuesIndex[queueNum1]].queue[teamNum2-1];
            }else{
                delete matchPool[queuesIndex[queueNum1]].queue[teamNum2];
            }
            matchPool[queuesIndex[queueNum1]].queue.length -= 2;
        }else{
            delete matchPool[queuesIndex[queueNum1]].queue[teamNum1];
            matchPool[queuesIndex[queueNum1]].queue.length -= 1;
            delete matchPool[queuesIndex[queueNum2]].queue[teamNum2];
            matchPool[queuesIndex[queueNum2]].queue.length -= 1;
        }
        broadCastMatchResult(firstTeam, secondTeam);
        matchPool[poolIndex].delay -= 2;
        if(matchPool[poolIndex].delay < 0){
            matchPool[poolIndex].delay = 0;
        }
    }
}

function matchSchedulingLevel3(matchPool, poolIndex){
    var indexes = [];
    if(parseInt(poolIndex) >= 4100){
        //前找4个
        indexes.push(String(poolIndex));
        indexes.push(String(parseInt(poolIndex) - 50));
        indexes.push(String(parseInt(poolIndex) - 100));
        indexes.push(String(parseInt(poolIndex) - 150));
        indexes.push(String(parseInt(poolIndex) - 200));
    }else{
        //后找4个
        indexes.push(String(poolIndex));
        indexes.push(String(parseInt(poolIndex) + 50));
        indexes.push(String(parseInt(poolIndex) + 100));
        indexes.push(String(parseInt(poolIndex) + 150));
        indexes.push(String(parseInt(poolIndex) + 200));
    }

    var queues = [];
    var queuesIndex = [];
    var count = 0;
    for(var index in indexes){
        queues.push(matchPool[indexes[index]].queue);
        queuesIndex.push(indexes[index]);
        count += matchPool[indexes[index]].queue.length;
    }
    if(count >= matchLevel3MinCount){
        var matchList = excuteMatch(queues);
        var queueNum1 = matchList.firstTeam.queueNum;
        var teamNum1 = matchList.firstTeam.teamNum;
        var firstTeam = matchPool[queuesIndex[queueNum1]].queue[teamNum1];
        var queueNum2 = matchList.secondTeam.queueNum;
        var teamNum2 = matchList.secondTeam.teamNum;
        var secondTeam = matchPool[queuesIndex[queueNum2]].queue[teamNum2];

        if(firstTeam == undefined || secondTeam == undefined){
            return;
        }

        if(queueNum1 == queueNum2){
            delete matchPool[queuesIndex[queueNum1]].queue[teamNum1];
            if(teamNum1 < teamNum2){
                delete matchPool[queuesIndex[queueNum1]].queue[teamNum2-1];
            }else{
                delete matchPool[queuesIndex[queueNum1]].queue[teamNum2];
            }
            matchPool[queuesIndex[queueNum1]].queue.length -= 2;
        }else{
            delete matchPool[queuesIndex[queueNum1]].queue[teamNum1];
            matchPool[queuesIndex[queueNum1]].queue.length -= 1;
            delete matchPool[queuesIndex[queueNum2]].queue[teamNum2];
            matchPool[queuesIndex[queueNum2]].queue.length -= 1;
        }
        broadCastMatchResult(firstTeam, secondTeam);
        matchPool[poolIndex].delay -= 2;
        if(matchPool[poolIndex].delay < 0){
            matchPool[poolIndex].delay = 0;
        }
    }
}

function excuteMatch(queues){

    var newQueues = [];
    var newQueueIndexes = [];
    for(var queueNum in queues){
        if(queues[queueNum].length != 0){
            newQueues.push(queues[queueNum]);
            newQueueIndexes.push(queueNum);
        }
    }

    var queueCount = newQueues.length;

    var queueNum1 = (parseInt(Math.random() * 100)) % queueCount;
    var queueNum2 = (parseInt(Math.random() * 100)) % queueCount;
    if(queueNum1 == queueNum2 && newQueues[queueNum2].length == 1){
        if(queueNum1 == 0){
            queueNum1 ++;
        }else{
            queueNum1 --;
        }
    }


    var teamNum1 = (parseInt(Math.random() * 10 * newQueues[queueNum1].length)) % newQueues[queueNum1].length;
    var teamNum2 = (parseInt(Math.random() * 10 * newQueues[queueNum2].length)) % newQueues[queueNum2].length;
    if(queueNum1 == queueNum2 && teamNum1 == teamNum2){
        //调度到了同一个队伍
        if(queueCount = 1){
            //只有一个队列   说明该队列人数大于等于最小限制值
            if(teamNum2 == 0){
                teamNum2++;
            }else{
                teamNum2--;
            }
        }else{
            if(queueNum2 == 0){
                queueNum2 = 1;
                teamNum2 = 0;
            }else{
                queueNum2--;
                teamNum2 = 0;
            }
        }
    }
    var matchList = {
        'firstTeam':{
            'queueNum': newQueueIndexes[queueNum1],
            'teamNum': teamNum1
        },
        'secondTeam':{
            'queueNum': newQueueIndexes[queueNum2],
            'teamNum': teamNum2
        }
    }
    return matchList;
}

function broadCastMatchResult(firstTeam, secondTeam){
    var challengerTeam = firstTeam;
    var hostTeam = secondTeam;
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
    exports.battles[battle.battleName] = battle;
    // 将挑战队伍的所有用户加入到新的socket room
    for (var i in challengerTeam.participants) {
        socketProxy.userJoin(challengerTeam.participants[i].userId, battle.battleName);
    }
    // 将受挑战队伍的所有用户加入到新的socket room
    for (var i in hostTeam.participants) {
        socketProxy.userJoin(hostTeam.participants[i].userId, battle.battleName);
    }
    //teamProxy.printfAllTeamsInfo();
    // 向该对局中所有的用户广播对局信息
    socketProxy.stableSocketsEmit(exports.io.in(battle.battleName), battle.battleName, 'battleInfo', battle);
    socketProxy.stableSocketsEmit(exports.io.sockets, battle.battleName, 'lolRoomEstablish', {
        roomName: 'BULLUP' + String((new Date).valueOf()).substr(6),
        password: Math.floor(Math.random() * 1000), // 4位随机数
        creatorId: challengerTeam.captain.userId
    });
}

exports.handleMatch = function(io){
    this.io = io;
}

exports.strengthScoreChangedCalculation = function(winnerScore, loserScore){
	var newScore = {};	
	var D = Math.abs(winnerScore - loserScore);
	var K = 10;
	var Sa = 1.0 / (1 + Math.pow(10, -1 * D / 400));
	var diff = 2;
	var losePunishment = 0;
	if(D >= 100){
		//There is big stength gap
		if(winnerScore > loserScore){
			diff = 1.6;
			diff = 1.6;
		}else{
			diff = 2.5;
			diff = 2.5;
			if(D >= 200){
				//If there is greate stength gap and the team which has higher strength score lose the game
				losePunishment = 0.6;
			}
		}
	}
	var newWinnerScore = Math.round(winnerScore + K * Sa * diff);
	var newLoserScore = Math.round(loserScore - K * (1 - Sa + losePunishment) * diff);
	newLoserScore = newLoserScore < 0 ? 0 : newLoserScore;	
	newScore.newWinnerScore = newWinnerScore;
	newScore.newLoserScore = newLoserScore;
	return newScore;
}