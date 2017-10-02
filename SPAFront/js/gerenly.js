
var request = require("request");

$().ready(function(){
    $('#router_index').on('click', function(e){
        e.preventDefault();
        var $role = userInfo.userRole;
        //alert($role);
        if($role==1){
            bullup.loadTemplateIntoTarget('swig_admin.html', {}, 'main-view');
            $.getScript('/js/zymly.js');
            
        }else{
            bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
            $.getScript('/js/zymly.js');
            $.getScript('/js/payment.js');
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
            var $userId = userInfo.userId;
            socket.emit('getBalance',{
                userId:$userId
            });            
        }
	});
});

   

    
  
    
    