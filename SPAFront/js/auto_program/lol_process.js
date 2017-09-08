var child_process = require("child_process");

exports.grabLOLData = function(type){
    child_process.exec('node sync_lol_' + type + '_process.js', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
        }
        if(stderr){
            console.log('sync_lol_process stderr: ' + stderr);
        }
        stdout = JSON.parse(stdout);
        var packet;
        if(stdout.UserInfo != undefined){
            packet = processLoginPacket(stdout);
            socket.emit('lolLoginResult', packet);
        }else if(stdout.actions != undefined){
            packet = processRoomPacket(stdout);
            socket.emit('lolRoomEstablished', packet);
        }else if(stdout.gameMode != undefined){
            packet = processResultPacket(stdout);
            socket.emit('lolBattleResult', packet);
        }
        //console.log(packet); 
    });
}


function processLoginPacket(stdout){
    var loginPacket = {};
    loginPacket.head = "user";
    loginPacket.accountId = stdout.UserInfo.userId;
	loginPacket.nickname = stdout.UserInfo.displayName;
    loginPacket.lastRank = stdout.UserInfo.lastSeasonRank;
    //{head: "user", accountId: 2936285067, nickname: "Spa丶", lastRank: "UNRANKED"}
    return loginPacket;
}

function processRoomPacket(stdout){
    var roomPacket = {};
    roomPacket.head = "room";
    var blueSide = [];
    var redSide = [];
    var blueSideCount = 0;
    var redSideCount = 0;
    if(stdout.myTeam[0].team == 1){
        //My team is blue
        for(var playerIndex in stdout.myTeam){
            blueSide[blueSideCount] = stdout.myTeam[playerIndex].summonerId;
            blueSideCount++;
        }
        for(var playerIndex in stdout.theirTeam){
            redSide[redSideCount] = stdout.theirTeam[playerIndex].summonerId;
            redSideCount++;
        }
    }else{
        //My team is red
        for(var playerIndex in stdout.theirTeam){
            blueSide[blueSideCount] = stdout.theirTeam[playerIndex].summonerId;
            blueSideCount++;
        }
        for(var playerIndex in stdout.myTeam){
            redSide[redSideCount] = stdout.myTeam[playerIndex].summonerId;
            redSideCount++;
        }
    }
    roomPacket.blueSide = blueSide;
    roomPacket.redSide = redSide;
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
    return resultPacket;
}

