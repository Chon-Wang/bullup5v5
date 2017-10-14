/**个人中返回按钮 */
//资金流动
$("#back").on('click',function(){
    // bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    // $.getScript('/js/zymly.js');
    // $.getScript('/js/payment.js');
    var $userId = userInfo.userId;
    socket.emit('getBalance',{
        userId:$userId
    });
});
//提现
$("#back_recharge").on('click',function(){
    
    // bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    // $.getScript('/js/zymly.js');
    // $.getScript('/js/gerenly.js');
    var $userId = userInfo.userId;
    socket.emit('getBalance',{
        userId:$userId
    });
})
//更改信息
$("#back-update").on('click',function(e){
    e.preventDefault();
    
    // bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    // $.getScript('/js/zymly.js');
    // $.getScript('/js/gerenly.js');
    var $userId = userInfo.userId;
    socket.emit('getBalance',{
        userId:$userId
    });
})