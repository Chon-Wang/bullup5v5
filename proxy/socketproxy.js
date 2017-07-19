
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
exports.remove = function(userId) {
    this.socketUserMap[userSocketMap[userId].id] = null;
    this.userSocketMap[userId] = null;
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
exports.mapToSocket = function(userId) {
    return this.userSocketMap[userId];
}