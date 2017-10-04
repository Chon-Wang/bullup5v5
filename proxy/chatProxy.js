var logger = require('../util/logutil');
var socketProxy = require('./socketProxy.js');

exports.init = function () {
    
}


exports.handleChat=function(io,socket){
      socket.on('chatMsg',function(data){
         
      logger.listenerLog('chatMsg');
      var feeback={};
      feeback.errCode=0;
      feeback.text='发送成功';
      feeback.type='SENDCHAT';
      feeback.extension={    
      } 
       
      io.sockets.emit('chatMsg',data);//广播 
      //console.log(data);
      });
      //console.log("----------------------------");
}
