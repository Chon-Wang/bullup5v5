/**个人中返回按钮 */
//资金流动
$("#back").on('click',function(){
    bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
        $.getScript('/js/zymly.js');
        $.getScript('/js/payment.js');
   // $.getScript('/js/gerenly.js');
   options = {
    url: 'http://127.0.0.1:3001',
    };
    request(options, function(error, response, body){
    var bodyStartIndex = body.indexOf("<body>");
    var bodyEndIndex = body.indexOf("</body>");
    var htmlStr = body.substr(0, bodyEndIndex);
    htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
    $('#payment').html(htmlStr);
    });	
});
//提现
$("#back_recharge").on('click',function(){
    bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
     $.getScript('/js/zymly.js');
     $.getScript('/js/gerenly.js');
     options = {
        url: 'http://127.0.0.1:3001',
        };
        request(options, function(error, response, body){
        var bodyStartIndex = body.indexOf("<body>");
        var bodyEndIndex = body.indexOf("</body>");
        var htmlStr = body.substr(0, bodyEndIndex);
        htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
        $('#payment').html(htmlStr);
        });	
})
//更改信息
$("#back-update").on('click',function(){
    bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
    $.getScript('/js/zymly.js');
    $.getScript('/js/gerenly.js');
    options = {
        url: 'http://127.0.0.1:3001',
        };
        request(options, function(error, response, body){
        var bodyStartIndex = body.indexOf("<body>");
        var bodyEndIndex = body.indexOf("</body>");
        var htmlStr = body.substr(0, bodyEndIndex);
        htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
        $('#payment').html(htmlStr);
        });	
})