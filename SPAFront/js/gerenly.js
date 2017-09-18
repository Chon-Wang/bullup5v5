
var request = require("request");

$().ready(function(){
    $('#router_index').on('click', function(e){
            e.preventDefault();
            bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
            $.getScript('/js/zymly.js');
            $.getScript('/js/payment.js');
            options = {
                url: 'http://67.216.196.197:3001',
            };
            request(options, function(error, response, body){
                var bodyStartIndex = body.indexOf("<body>");
                var bodyEndIndex = body.indexOf("</body>");
                var htmlStr = body.substr(0, bodyEndIndex);
                htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
                $('#payment').html(htmlStr);
            });
	    });
    });
   

    
  
    
    