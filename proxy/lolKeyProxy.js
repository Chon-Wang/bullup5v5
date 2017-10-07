var fs = require('fs');
var userProxy = require('./userProxy.js');
var socketProxy = require('./socketProxy.js');

exports.init = function () {
    var key = fs.readFileSync('./key.txt').toString();
    this.lolApiKey = key;
}


exports.handleLOLKeyRequest = function(socket){
    socket.on('LOLKeyRequest', function(){
        socketProxy.stableSocketEmit(socket, 'feedback', {
            'errorCode': 0,
            'text': '',
            'type': 'LOLKEYREQUESTRESULT',
            'extension': {
                'key': exports.lolApiKey
            }
        });
    });
}


exports.handleLOLKeyUpdate = function(socket){
    socket.on('lolKeyUpdate', function(){
        var userId = socketProxy.mapSocketToUserId(socket.id);
        var user = userProxy.users[userId];
        if(user.userRole == 1){
            //管理员 更新key
            var key = fs.readFileSync('./key.txt').toString();
            exports.lolApiKey = key;
            socketProxy.stableSocketEmit(socket, 'feedback', {
                'errorCode': 0,
                'text': 'LOL数据接口密钥更新成功',
                'type': 'LOLUPDATERESULT',
                'extension': null
            });
        }else{
            socketProxy.stableSocketEmit(socket, 'feedback', {
                'errorCode': 1,
                'text': 'LOL数据接口密钥更新失败',
                'type': 'LOLUPDATERESULT',
                'extension': null
            });
        }
        
    });
}