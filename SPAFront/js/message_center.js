$(document).ready(function(){
    $("#message_center_nav").on('click', function(e){
        console.log(' messages : ' + messageInfo);
        var messagesHtml = douniu.loadSwigView('./swig_messages.html',{
            messages: messageInfo
        });
        $("#message_center").html(messagesHtml);

        $(".message_accept_btn").unbind();
        $(".message_accept_btn").on('click', function(e){
            var messageAcceptBtnId = $(this).attr('id');
            var messageAcceptBtnIdString = String(messageAcceptBtnId);
            messageAcceptBtnIdString = messageAcceptBtnIdString.substring(messageAcceptBtnIdString.indexOf('_') + 1);
            var messageIndexString = messageAcceptBtnIdString.substring(0,messageAcceptBtnIdString.indexOf('_'));

        });

        $(".message_reject_btn").on('click', function(e){
            var messagRejectBtnId = $(this).attr('id');
            var messagRejectBtnIdString = String(messageAcceptBtnId);
            messageRejectBtnIdString = messageAcceptBtnIdString.substring(messageAcceptBtnIdString.indexOf('_') + 1);
            var messageIndexString = messageAcceptBtnIdString.substring(0,messageAcceptBtnIdString.indexOf('_'));

        });
    });    
});