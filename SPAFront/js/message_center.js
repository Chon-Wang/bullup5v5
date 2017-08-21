$(document).ready(function(){
    $("#message_center_btn").on('click', function(e){
        var messagesHtml = douniu.loadSwigView('./swig_messages.html',{
            messages: messageInfo
        });
        $("#message_center").html(messagesHtml);
    });
});