var userSocketMap = {};

/**
 * 添加用户id和socket的映射
 * @param userId 用户id
 * @param socket 用于连接的socket包
 */
exports.add = function(userId, socket) {
    userSocketMap[userId] = socket;
}


/**
 * 删除映射
 * @param userId 用户id 
 */
exports.remove = function(userId) {
    userSocketMap[userId] = null;
}