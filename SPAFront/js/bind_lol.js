$().ready(function () {
    $('#bind_lol_btn').on('click', function(e){
        if(userInfo == null || userInfo.userId == undefined){
            bullup.alert("请先登录，在绑定LOL账号！");
        } else{
            bullup.alert("请登录LOL并稍作等待，系统会自动绑定您登陆的LOL账号");
            var lol_process = require('./js/auto_program/lol_process.js');
            //发送英雄联盟登录包
            lol_process.grabLOLData('login', socket);
        }
    });
});