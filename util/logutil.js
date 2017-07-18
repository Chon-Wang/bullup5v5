/**
 * 用于格式化输出日志的工具
 */

 /**
  * 格式化输出listener信息
  */
exports.listenerLog = function(listenerName) {
    console.log('In ' + listenerName + ' listener!');
}

/**
 * 格式化输出json子串信息
 * @param jsonInfo json串
 */
exports.jsonLog = function(jsonInfo) {
    console.log(JSON.stringify(jsonInfo, null , '\t'));
}

/**
 * 格式化输出多层字串
 * @param level 成熟
 * @param content 内容
 */
exports.levelMsgLog = function(level, content) {
    var prefix = '';
    for (var i = 0; i < level; ++i) {
        prefix += '\t';
    }
    console.log(prefix + content);
}

exports.methodLog = function(methodName) {
    console.log('In ' + methodName + ' method!');
}