var userPacket =
{
    name: 'hudsonjoe',
    userId: 13,
    avatarId: 15,
    strength: {
        growth: 1313,
        kda: 2.2,
        averageGoldEarned: 1333.3,
        averageTurretsKilled: 113,
        averageLiving: 13,
        averageDamageTaken: 131
    },
    wealth: 10000,
    online: true,
    status: 'IDLE', //  'GAMING', 'INTEAM'
    friendList: {
        'colinyoung': {
            name: 'colinyoung',
            userId: 14,
            avatarId: 11,
            online: true,
            status: 'IDLE', //  'GAMING', 'INTEAM'
        }
        // ...
    },
    relationMap:{
        currentTeamId: 'hudsonjoe134124',
        currentGameId: 'hudsonjoecolinyoung13214124'

    }
}

var teamPacket =
{
    name: 'hudsonjoe134124', // 用户昵称 + 时间戳
    captain: {
        name: 'hudsonjoe',
        userId: 13,
        avatarId: 15,
        strength: {
            growth: 1313,
            kda: 2.2,
            averageGoldEarned: 1333.3,
            averageTurretsKilled: 113,
            averageLiving: 13,
            averageDamageTaken: 131
        }
    },
    participants: [
        {
            name: 'hudsonjoe',
            userId: 13,
            avatarId: 15,
            strength: {
                growth: 1313,
                kda: 2.2,
                averageGoldEarned: 1333.3,
                averageTurretsKilled: 113,
                averageLiving: 13,
                averageDamageTaken: 131
            }
        },
        // 其他用户信息
    ],
    status: 'ESTABLISHING',// 'PUBLISHING' 'MATCHING' 'GAMING'
    type: 'BATTLE', // 'MATCH'
    bet: 100, // 赌注
    mapId: 1,
    rule: '基地爆炸'
}

var feedBack = {
    errorCode: 1,
    text: '用户拒绝邀请',
    type: 'INVITERESULT', 
    extension: {}//根据type确定extension
}


// 邀请好友
var invitePacket = {
    name: 'colinyoung',
    userId: 14,
    host: {
        name: 'hudsonjoe',
        userId: 13
    },
    team: {
        name: 'hudsonjoe134124',
        bet: 100, // 赌注
        mapId: 1,
        rule: '基地爆炸'
    }
}

// 接收或拒绝邀请
var inivitFeedback = {
    errorCode: 0,     // if refused, errorCode is 1
    type: 'INVITERESULT',
    text: 'colinyoung加入游戏', //如果拒绝,text为colinyoung拒绝加入游戏 
    extension: {      // 如果受邀用户拒绝,则extension只有hostName字段和userInfo的name字段
        hostName: 'hudsonjoe',
        teamName: 'hudsonjoe134124',
        userInfo:  {
            name: 'colinyoung',
            userId: 14,
            avatarId: 15,
            strength: {
                growth: 1313,
                kda: 2.2,
                averageGoldEarned: 1333.3,
                averageTurretsKilled: 113,
                averageLiving: 13,
                averageDamageTaken: 131
            }
        }
    }
}


var establishTeamPacket = {
    teamName: 'hudsonjoe134124',
    userId: 13
}

/** 服务器数据结构
 * 这里有一个未创建的队伍列表和一个已经创建完毕的队伍列表
 */


var broadcastTeamList = [
    {
        name: 'hudsonjoe134124', // 用户昵称 + 时间戳
        status: 'ESTABLISHING',// 'PUBLISHING' 'MATCHING' 'GAMING'
        type: 'BATTLE', // 'MATCH'
        bet: 100, // 赌注
        mapId: 1,
        rule: '基地爆炸',
        participantsCount: 5
    }
]

var teamDetailsRequest = {
    teamName: 'hudsonjoe134124',
    userId: 14
}

var fightRequest = {
    teamName: 'hudsonjoe134124',
    userId: 14,
    myteamName: 'gjm1230123'
}

/**
 * 服务器转发对战请求,直接向客户端发送TeamPacket
 */

 // 用户接受或拒绝对战
 var feedback = {
     errorCode: 0,
     type: 'FIGHTRESULT',
     text: null,
     extension: {
         team1Name: 'hudsonjoe134124',
         team2Name: 'gjm1230123'
     }
 }


// 服务端缓存中保存的对局信息
var game = {
    gameName:'hudsonjoegjm124124', //captain1+captain2+timestamp
    blueSide: { 
        teamPacket: {
          //  ...
        }
    },
    redSide: {
        teamPacket: {
          //  ...
        }
    },
    status:'unready',
    time:{
        unready: '20170715162600',
        ready: '20170715165000', //对局建立后,所有用户需要在一分钟以内点准备
        start: '20170715165800' //所有玩家准备后,所有用户需在8分钟以内点开始
    }
}

// 服务端向客户端发送的创建LOL房间的数据包
var createLOLRoom = {
    gameName: 'hudsonjoegjm124124',
    name: 'BullUP24234', // BULLUP + 时间戳
    password: '1234' // 随机4位数 
}

// 客户端创建完lol房间反馈给服务器
var feedback = {
    errorCode: 0,
    text: null,
    type: 'ROOMCREATERESULT',
    extension: {
        gameName: 'hudsonjoegjm124124',
        name: 'BullUP24234', // BULLUP + 时间戳
        password: '1234' // 随机4位数 
    }
}

var lolRoomBroadcastPacket = {
    gameName: 'hudsonjoegjm124124',
    name: 'BullUP24234', // BULLUP + 时间戳
    password: '1234' // 随机4位数 
}
