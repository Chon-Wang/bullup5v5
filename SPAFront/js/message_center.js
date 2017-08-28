$(document).ready(function(){
    $("#message_center_nav").on('click', function(e){
        Materialize.toast("asdad", 4000);        
        //console.log(' messages : ' + messageInfo);
        var messagesHtml = douniu.loadSwigView('./swig_messages.html',{
            messages: messageInfo
        });
        $("#message_center").html(messagesHtml);
        //if(!$._data($(".message_accept_btn")[0], "events") || !$._data($(".message_accept_btn")[0], "events")["click"])
        $.getScript('./js/message_operation.js');
    });    
});