
exports.init = function() {
    this.userSocketMap = {};
    this.socketUserMap = {};
}
/**
 * 添加用户id和socket的映射
 * @param userId 用户id
 * @param socket 用于连接的socket包
 */
exports.add = function(userId, socket) {
    this.userSocketMap[userId] = socket;
    this.socketUserMap[socket.id] = userId;
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
exports.mapUserIdToSocket = function(socketId) {
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