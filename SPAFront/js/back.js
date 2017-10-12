/**个人中返回按钮 */
//资金流动
$("#back").on('click',function(){
    bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    $.getScript('/js/zymly.js');
    $.getScript('/js/payment.js');
});
//提现
$("#back_recharge").on('click',function(){
    bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    $.getScript('/js/zymly.js');
    $.getScript('/js/gerenly.js');
})
//更改信息
$("#back-update").on('click',function(){
    bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    $.getScript('/js/zymly.js');
    $.getScript('/js/gerenly.js');
})