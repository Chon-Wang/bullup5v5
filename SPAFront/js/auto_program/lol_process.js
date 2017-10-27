var process = require("child_process");
var log = require("./logutil.js")
var fs = require("fs");

exports.grabLOLData = function(type, socket){
    //log.logToFile("D://temp_log.txt", "append", "grabbing");
    switch (type){
        case "login": {
            syncLogin(function(jsonStr){
                jsonStr = JSON.parse(jsonStr);
                if(jsonStr.UserInfo != undefined){
                    var packet = processLoginPacket(jsonStr);
                    //log.logToFile("D://temp_log.txt", "append", "grabbing data is " + JSON.parse(packet));
                    socket.emit('lolLoginResult', packet);
                }
            });
            break;
        }
        case "room": {
            syncRoom(function(jsonStr){
                jsonStr = JSON.parse(jsonStr);
                if(jsonStr.actions != undefined){
                    var packet = processRoomPacket(jsonStr);
                    //log.logToFile("D://temp_log.txt", "append", "grabbing data is " + JSON.parse(packet));
                    socket.emit('lolRoomEstablished', packet);
                }
            });
            break;
        }
        case "result": {
            syncResult(function(jsonStr){
                jsonStr = JSON.parse(jsonStr);
                if(jsonStr.gameMode != undefined){
                    var packet = processResultPacket(jsonStr);
                    //log.logToFile("D://temp_log.txt", "append", "grabbing data is " + JSON.parse(packet));
                    socket.emit('lolBattleResult', packet);
                }
            });
            break;
        }
    }
}

function readJsonStr(path, callback){
    fs.readFile(path, 'utf-8', function(err,data){  
        if(err)  
            throw err;  
        var jsonObj=JSON.parse(data);  
        callback(JSON.stringify(jsonObj));
    });
}
 
function syncLogin(callback){
    process.exec('C:/Users/Public/Bullup/auto_program/BullupServiceNew UserInfo', function(error, stdout, stderr){
        if(error){
            throw error;
        }
        readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
            log.logToFile("D://login_log.txt", "append",jsonStr);
            callback(jsonStr);
        });
    });
    // process.execSync('C:/Users/Public/Bullup/auto_program/BullupServiceNew UserInfo');
    // readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
    //     log.logToFile("D://temp_log.txt", "append",jsonStr);
    //     callback(jsonStr);
    // });
}

function syncRoom(callback){
    process.exec('C:/Users/Public/Bullup/auto_program/BullupServiceOld actions', function(error, stdout, stderr){
        if(error){
            throw error;
        }
        readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
            log.logToFile("D://room_log.txt", "append",jsonStr);
            callback(jsonStr);
        });
    });
    
    // process.execSync('C:/Users/Public/Bullup/auto_program/BullupServiceOld actions');
    // readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
    //     log.logToFile("D://temp_log.txt", "append",jsonStr);
    //     callback(jsonStr);
    // });
}

function syncResult(callback){
    process.exec('C:/Users/Public/Bullup/auto_program/BullupServiceOld gameMode', function(error, stdout, stderr){
        if(error){
            throw error;
        }
        readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
            log.logToFile("D://result_log.txt", "append",jsonStr);
            callback(jsonStr);
        });
    });
    // process.execSync('C:/Users/Public/Bullup/auto_program/BullupServiceOld gameMode');
    // readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
    //     log.logToFile("D://temp_log.txt", "append",jsonStr);
    //     callback(jsonStr);
    // });
}


function processLoginPacket(stdout){
    var loginPacket = {};
    var rankTierInfo = String(stdout.UserInfo.rankedTierInfo);
    var ranks = ['UNRANKED','BRONZE','SILVER','GOLD','PLATINUM','DIAMOND','MASTER','CHALLENGER'];
    loginPacket.currentRank = 'UNRANKED';
    for(var index in ranks){
        if(rankTierInfo.indexOf(ranks[index]) != -1){
            loginPacket.currentRank = ranks[index];
            break;
        }
    }
    loginPacket.head = "user";
    loginPacket.accountId = stdout.UserInfo.userId;
	loginPacket.nickname = stdout.UserInfo.displayName;
    loginPacket.lastRank = stdout.UserInfo.lastSeasonRank;
    loginPacket.serverName = stdout.UserInfo.serverName;
    //{head: "user", accountId: 2936285067, nickname: "Spa丶", lastRank: "UNRANKED", currenRank: "SILVER", serverName: "外服"}
    return loginPacket;
}

function processRoomPacket(stdout){
    var roomPacket = {};
    roomPacket.head = "room";
    // stdout = stdout.BattleInfo.gameData;
    // roomPacket.myTeam = stdout.teamOne;
    // roomPacket.theirTeam = stdout.teamTwo;
    roomPacket.myTeam = stdout.myTeam;
    roomPacket.theirTeam = stdout.theirTeam;
    return roomPacket;
}

function processResultPacket(stdout){
    var resultPacket = {};
    resultPacket.head = "result";
    resultPacket.accountId = stdout.accountId;
    resultPacket.gameMode = stdout.gameMode;
    resultPacket.gameType = stdout.gameType;
    if(stdout.teams[0].players[0].stats.WIN == 1){
        resultPacket.win = "yes";
    }else{
		resultPacket.win = "no";
    }
    resultPacket.participants = [];

    var team1 = stdout.teams[0].players;
    for(var playerIndex in team1){
        var player = {};
        player.accountId = team1[playerIndex].summonerId;
        player.stats = {};
        player.stats.kill = team1[playerIndex].stats.CHAMPIONS_KILLED;
        player.stats.damage = team1[playerIndex].stats.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS;
        player.stats.damageTaken = team1[playerIndex].stats.TOTAL_DAMAGE_TAKEN;
        player.stats.heal = team1[playerIndex].stats.TOTAL_HEAL;
        player.stats.goldEarned = team1[playerIndex].stats.GOLD_EARNED;
        player.stats.death = team1[playerIndex].stats.NUM_DEATHS;
        player.stats.assists= team1[playerIndex].stats.ASSISTS;
        resultPacket.participants.push(player);
    }

    var team2 = stdout.teams[1].players;
    for(var playerIndex in team2){
        var player = {};
        player.accountId = team2[playerIndex].summonerId;
        player.stats = {};
        player.stats.kill = team2[playerIndex].stats.CHAMPIONS_KILLED;
        player.stats.damage = team2[playerIndex].stats.TOTAL_DAMAGE_DEALT_TO_CHAMPIONS;
        player.stats.damageTaken = team2[playerIndex].stats.TOTAL_DAMAGE_TAKEN;
        player.stats.heal = team2[playerIndex].stats.TOTAL_HEAL;
        player.stats.goldEarned = team2[playerIndex].stats.GOLD_EARNED;
        player.stats.death = team2[playerIndex].stats.NUM_DEATHS;
        player.stats.assists= team2[playerIndex].stats.ASSISTS;
        resultPacket.participants.push(player);
    }

    return resultPacket;
}

//exports.grabLOLData("login", null);
//exports.grabLOLData("room", null);
//exports.grabLOLData("result", null);