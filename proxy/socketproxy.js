exports.init = function() {
    this.userSocketMap = {};
    this.socketUserMap = {};

    //用于设置最大重发次数的阈值
    this.maxResendTimes = 150;

    //多少ms重发一次
    this.timeInterval = 500;

    //用于存储需要发送到客户端的消息
    this.socketEmitQueue = {};
    /* 
        socket.id:{
            socketObj: socket,
            dataQueue:[
                {
                    header: 'feedback',
                    data: feedback,
                    createTimeStamp:  15041042140,
                    sendTimes: 2,
                    status: unrecieved
                }
            ]
        }
    */
    //用于存储需要广播的消息
    this.broadcastEmitQueue = [];
}

exports.add = function(userId, socket) {
    this.userSocketMap[userId] = socket;
    this.socketUserMap[socket.id] = userId;
    console.log("userSocketMap: " + this.userSocketMap[userId].id);
    console.log("socketUserMap: " + this.socketUserMap[socket.id]);
}

exports.getMapInfo = function(){
    return this.userSocketMap;
}

exports.remove = function(socket) {
    this.userSocketMap[this.socketUserMap[socket.id].userId] = null;
    this.socketUserMap[socket.id] = null;
}

exports.isUserOnline = function(userId) {
    return this.userSocketMap[userId]? true: false;
}

exports.mapUserIdToSocket = function(userId) {
    return this.userSocketMap[userId];
}

exports.mapSocketToUserId = function(socketId) {
    return this.socketUserMap[socketId];
}

exports.userJoin = function (userId, roomName) {
    this.userSocketMap[userId].join(roomName);
}

//----------------------------------------------------------//
//将需要发送到客户端的消息放置到相应的消息队列里
exports.stableSocketEmit = function(socket, head, data){
    var index = socket.id;
    var token = Math.random().toString(36).substring(7) + socket.id; 
    data.token = token;
    if(exports.socketEmitQueue[index] != undefined){
        exports.socketEmitQueue[index].dataQueue[String(token)] = {
            'header': head,
            'data': data,
            'createTimeStamp': 0,
            'sendTimes': 0,
            'status': 'unrecieved'
        };
    }else{
        exports.socketEmitQueue[index] = {};
        exports.socketEmitQueue[index].socketObj = socket;
        exports.socketEmitQueue[index].dataQueue = {};
        exports.socketEmitQueue[index].dataQueue[String(token)] = {
            'header': head,
            'data': data,
            'createTimeStamp': 0,
            'sendTimes': 0,
            'status': 'unrecieved'
        };
    }
}

exports.stableSocketsEmit = function(sockets, roomName, head, data){
    for(socketId in sockets.sockets){
        var socket = sockets.sockets[socketId];
        if(socket.rooms[roomName] != undefined){
            exports.stableSocketEmit(socket, head, data);
        }
    }
}

exports.stableEmit = function(){
    if (exports.socketEmitQueue != undefined && 
        exports.broadcastEmitQueue != undefined && 
        exports.maxResendTimes != undefined && 
        exports.timeInterval != undefined){
        // socket.id:{
        //     socketObj: socket,
        //     dataQueue: {
        //         dataToken: {
        //             header: 'feedback',
        //             data: feedback,
        //             createTimeStamp: 15041042140,
        //             sendTimes: 2,
        //             status: unrecieved
        //         }
        //     }
        // }

        for(socketId in exports.socketEmitQueue){
            var socketObj = exports.socketEmitQueue[socketId].socketObj;
            var dataQueue = exports.socketEmitQueue[socketId].dataQueue;
            var data = {'blank': true};
            for(dataToken in dataQueue){
                data = dataQueue[dataToken];
                data.sendTimes = data.sendTimes+1;
                if(data.sendTimes >= exports.maxResendTimes){
                    //重发次数达到或超过最大重发次数则删除该条消息
                    delete exports.socketEmitQueue[socketId].dataQueue[dataToken];
                }
                break;
            }
            if(data.blank != true){
                console.log('send to ' + socketObj.id);
                socketObj.emit(data.header, data.data);
                delete data;
            }else{
                continue;
            }
        }
    }else{
        exports.init();
    }
}

exports.handleReceivedTokenData = function(socket){
    socket.on('tokenData', function(tokenData){
        //从未发送的消息队列中删除该项
        delete exports.socketEmitQueue[socket.id].dataQueue[tokenData];
    });
}

exports.startstableEmiter = function(){
    //setInterval(exports.stableEmit, exports.timeInterval);
}
//----------------------------------------------------------//