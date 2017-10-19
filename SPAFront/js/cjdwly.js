
$().ready(function(){
    $('#router_chat').on('click', function(e){
        e.preventDefault();
        if(!userInfo){
                bullup.alert('请登录后查看');
        }else{
                bullup.loadTemplateIntoTarget('swig_chatroom.html', {}, 'main-view');
                $.getScript('./js/chat.js');
        }   
});
   
$('#return').on('click', function(e){
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
                $.getScript('/js/zymly.js');
                $.getScript('/js/Withdraw.js');
        });  
 });
   

    