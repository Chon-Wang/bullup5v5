exports.init = function() {
    this.userSocketMap = {};
    this.socketUserMap = {};

    //用于设置最大重发次数的阈值
    this.maxResendTimes = 15;

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
/**
 * 添加用户id和socket的映射
 * @param userId 用户id
 * @param socket 用于连接的socket包
 */
exports.add = function(userId, socket) {
    this.userSocketMap[userId] = socket;
    this.socketUserMap[socket.id] = userId;
    console.log("userSocketMap: " + this.userSocketMap[userId].id);
    console.log("socketUserMap: " + this.socketUserMap[socket.id]);
}

exports.getMapInfo = function(){
    return this.userSocketMap;
}

/**
 * 删除映射
 * @param userId 用户id 
 */
exports.remove = function(socket) {
    this.userSocketMap[this.socketUserMap[socket.id].userId] = null;
    this.socketUserMap[socket.id] = null;
}

/**
 * 用户是否在线
 * @param userId 用户id
 */
exports.isUserOnline = function(userId) {
    return this.userSocketMap[userId]? true: false;
}

/**
 * 通过用户id映射socket
 * @param userId 用户id
 */
exports.mapUserIdToSocket = function(userId) {
    return this.userSocketMap[userId];
}

/**
 * 通过socketid映射user
 * @param socketId socketid
 */
exports.mapSocketToUserId = function(socketId) {
    return this.socketUserMap[socketId];
}


/**
 * 将用户的socket加入某个房间
 * @param userId 用户的id
 * @param roomName 要加入的房间
 */
exports.userJoin = function (userId, roomName) {
    this.userSocketMap[userId].join(roomName);
}


//----------------------------------------------------------//
//将需要发送到客户端的消息放置到相应的消息队列里
exports.portableSocketEmit = function(socket, head, data){
    var index = socket.id;
    if(exports.socketEmitQueue.index != undefined){
        socketEmitQueue.index.dataQueue.push({
            'header': head,
            'data': data,
            'createTimeStamp': 0,
            'sendTimes': 0,
            'status': 'unrecieved'
        });
    }else{
        socketEmitQueue.index = {};
        socketEmitQueue.index.socketObj = socket;
        socketEmitQueue.index.dataQueue = [];
        socketEmitQueue.index.dataQueue.push({
            'header': head,
            'data': data,
            'createTimeStamp': 0,
            'sendTimes': 0,
            'status': 'unrecieved'
        });
    }
}

exports.portableSocketsEmit = function(sockets, head, data){

}

exports.portableEmit = function(){
    if (exports.socketEmitQueue != undefined && 
        exports.broadcastEmitQueue != undefined && 
        exports.maxResendTimes != undefined && 
        exports.timeInterval != undefined){
        
        // socket.id:{
        //     socketObj: socket,
        //     dataQueue:[
        //         {
        //             header: 'feedback',
        //             data: feedback,
        //             createTimeStamp:  15041042140,
        //             sendTimes: 2,
        //             status: unrecieved
        //         }
        //     ]
        // }
        for(socketId in socketEmitQueue){
            var socketObj = socketEmitQueue[socketId].socketObj;
            var dataQueue = socketEmitQueue[socketId].dataQueue;

        }

    }else{
        exports.init();
    }
}
//----------------------------------------------------------//