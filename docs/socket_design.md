# 通信协议与数据结构
<!-- TOC -->

- [通信协议与数据结构](#通信协议与数据结构)
    - [用户登录包](#用户登录包)
    - [用户注册包](#用户注册包)
    - [通讯图](#通讯图)
    - [登录的用户包](#登录的用户包)
    - [队伍组建包](#队伍组建包)
    - [反馈包](#反馈包)
    - [邀请好友数据包](#邀请好友数据包)
    - [邀请数据包](#邀请数据包)
    - [确认创建队伍](#确认创建队伍)
    - [服务器中维护队伍的数据结构](#服务器中维护队伍的数据结构)
    - [队伍列表的数据](#队伍列表的数据)
    - [队伍详情请求包](#队伍详情请求包)
    - [战斗请求包](#战斗请求包)
    - [对战请求](#对战请求)
    - [对战请求结果反馈](#对战请求结果反馈)
    - [一场对局的数据结构](#一场对局的数据结构)
    - [LOL房间创建数据包](#lol房间创建数据包)
    - [LOL房间反馈数据包](#lol房间反馈数据包)
    - [LOL广播数据包](#lol广播数据包)

<!-- /TOC -->
## 用户登录包
```js
var loginPacket = {
    userName: 'hudsonjoe',
    password: '123456'
}
```

## 用户注册包
```js
var registerPacket = {
    userName: 'colinyoung',
    password: '123456',
    tel: '18553358649',
    email: '1427714873@qq.com'
}
```
## 通讯图
![5v5逻辑图](.\5v5_logic@1-56.png)
## 登录的用户包
用户登陆之后服务端反馈的用户信息数据包
```js
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
```
## 队伍组建包
用户创建队伍时在服务端和客户端共同存在的队伍
```js
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
    status: 'ESTABLISHING',// 'PUBLISHING' 'MATCHING' 'GAMING' 'INBATTLE'
    type: 'BATTLE', // 'MATCH'
    bet: 100, // 赌注
    mapId: 1,
    rule: '基地爆炸'
}
```
## 反馈包
进行统一反馈时使用的数据包
```js
var feedBack = {
    errorCode: 1,
    text: '用户拒绝邀请',
    type: 'INVITERESULT', 
    extension: {}//根据type确定extension
}
```

## 邀请好友数据包
队长进行邀请好友时向服务端发送的数据包
```js
// 邀请好友
var invitePacket = {
    // 改名字为受邀者的名字
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
```
## 邀请数据包
接受拒绝邀请发送的数据
```js
var inivitFeedback = {
    errorCode: 0,     // if refused, errorCode is 1
    type: 'INVITERESULT',
    text: 'colinyoung加入游戏', //如果拒绝,text为colinyoung拒绝加入游戏 
    extension: {      // 如果受邀用户拒绝,则extension只有hostName字段和userInfo的name字段
        hostName: 'hudsonjoe',
        hostId: 13,
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
```

## 确认创建队伍
确认创建队伍发送的数据包
```js
var establishTeamPacket = {
    teamName: 'hudsonjoe134124',
    userId: 13
}
```

## 服务器中维护队伍的数据结构
这里有一个未创建的队伍列表和一个已经创建完毕的队伍列表

## 队伍列表的数据
在队长确认创建队伍信息,或者是某个客户端刷新, 客户端广播最新的队伍列表信息
```js
var broadcastTeamList = {
    'hudsonjoe134124': {
        teamName: 'hudsonjoe134124', // 用户昵称 + 时间戳
        status: 'ESTABLISHING',// 'PUBLISHING' 'MATCHING' 'GAMING'
        type: 'BATTLE', // 'MATCH'
        bet: 100, // 赌注
        mapId: 1,
        rule: '基地爆炸',
        participantsCount: 5
    }
}
```

## 队伍详情请求包
应战方点击在对战大厅中看到的某一个队伍时点击该队伍的详情发送的请求数据包
```js
var teamDetailsRequest = {
    teamName: 'hudsonjoe134124',
    userId: 14
}
```

## 战斗请求包
应战方在查看队伍详情后确定应战发送的战斗请求数据包
```js
var fightRequest = {
    challengerTeamName: 'hudsonjoe134124',
    hostTeamName: 'gjm1230123',
    userId: 14
}
```

## 对战请求
服务器转发对战请求,直接向客户端发送TeamPacket

## 对战请求结果反馈
用户拒绝或接受对战的反馈数据包
```js
 // 用户接受或拒绝对战
 var feedback = {
     errorCode: 0,
     type: 'FIGHTRESULT',
     text: null,
     extension: {
         challengerTeamName: 'hudsonjoe134124',
         hostTeamName: 'gjm1230123'
     }
 }
```
## 一场对局的数据结构
对局产生在服务端和客户端保存的对局的数据结构
```js
// 服务端缓存中保存的对局信息
var battle = {
    battleName:'hudsonjoegjm124124', //邀请者captain1+受邀者captain2+timestamp
    blueSide: { 
        // teamPacket
    },
    redSide: {
        // teamPacket
    },
    status:'unready',
    time:{
        unready: '20170715162600',
        ready: '20170715165000', //对局建立后,所有用户需要在一分钟以内点准备
        start: '20170715165800' //所有玩家准备后,所有用户需在8分钟以内点开始
    }
}
```
## LOL房间创建数据包
服务端向客户端发送的创建LOL房间的数据包
```js
var createLOLRoom = {
    roomName: 'BULLUP24234', // BULLUP + 时间戳
    password: '2345', // 4位随机数
    creatorId: '13' // 需要创建lol房间的用户为挑战者
}
```

## LOL房间反馈数据包
客户端创建完lol房间反馈给服务器
```js
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
```

## LOL广播数据包
服务端向游戏所有成员进行广播的数据包
```js
var lolRoomBroadcastPacket = {
    gameName: 'hudsonjoegjm124124',
    name: 'BullUP24234', // BULLUP + 时间戳
    password: '1234' // 随机4位数 
}
```