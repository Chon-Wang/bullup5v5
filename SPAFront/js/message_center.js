$(document).ready(function(){
    $("#message_center_nav").on('click', function(e){      
        //console.log(' messages : ' + messageInfo);
        var messagesHtml = bullup.loadSwigView('./swig_messages.html',{
            messages: messageInfo
        });
        $("#message_center").html(messagesHtml);
        //if(!$._data($(".message_accept_btn")[0], "events") || !$._data($(".message_accept_btn")[0], "events")["click"])
        $.getScript('./js/message_operation.js');
    });    
});