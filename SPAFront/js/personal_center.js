$(document).ready(function(){
    //#id  换成实际的那个个人中心 a标签的ID
    $('#router_personal').click(function(){
        //这里发送消息
        // userInfo 是客户端维护的全局变量  在socket_util.js中维护  当登录成功后userInfo里面有值 
        //var userInfo={};
        if(userInfo==null){
           // alert('请你登陆');
             function poroto_w(){
                      $('#modalpopo .modal-content  h4').text("提示：")
                      $('#modalpopo .ceneter_w').text("您没有登陆，请登录！")
                      $('#modalpopo').modal('open'); 
                 }
                 poroto_w();
            //location.href = '#log_modal';
        }else{
            socket.emit('pesonalCenterRequest',userInfo);
           
            

        } 
        
    });
});