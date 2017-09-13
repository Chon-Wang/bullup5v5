$().ready(function () {
    $('#bind_lol_account_btn').on('click', function(e){
        if(userInfo == null || userInfo.userId == undefined){
            alert("请先登录，在绑定LOL账号！");
        }else{
            alert("请登录LOL");
            var lol_process = require('C:/Users/Public/Bullup/auto_program/lol_process.js');
            //发送英雄联盟登录包
            lol_process.grabLOLData('login');
        }
    });
});