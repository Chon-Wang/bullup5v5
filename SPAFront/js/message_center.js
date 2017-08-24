$(document).ready(function(){
    $("#message_center_nav").on('click', function(e){
        //console.log(' messages : ' + messageInfo);
        var messagesHtml = douniu.loadSwigView('./swig_messages.html',{
            messages: messageInfo
        });
        $("#message_center").html(messagesHtml);
       console.log("pre-bind");
        //$(".message_accept_btn").unbind();
        //if(!$._data($(".message_accept_btn")[0], "events") || !$._data($(".message_accept_btn")[0], "events")["click"])
        $(".message_accept_btn").on('click', function(e){
            
            var messageAcceptBtnId = $(this).attr('id');
            var messageAcceptBtnIdString = String(messageAcceptBtnId);
            messageAcceptBtnIdString = messageAcceptBtnIdString.substring(messageAcceptBtnIdString.indexOf('_') + 1);
            var messageIndexString = messageAcceptBtnIdString.substring(0,messageAcceptBtnIdString.indexOf('_'));
            
            
            var message = messageInfo[Number.parseInt(messageIndexString)];
            
            var inviteResult = {
                errorCode: 0,
                type: 'INVITERESULT',
                text: userInfo.name + '加入游戏',
                extension: {
                    hostName: message.host.name,
                    hostId: message.host.userId,
                    teamName: message.team.name,
                    userInfo: {
                        name: userInfo.name,
                        userId: userInfo.userId,
                        avatarId: userInfo.avatarId,
                        strength: userInfo.strength
                    }
                }
            };
            socket.emit('inviteResult', inviteResult);
            //删除消息
            messageInfo.splice(Number.parseInt(messageIndexString), 1);
            //console.log(JSON.stringify(messageInfo[Number.parseInt(messageIndexString)]));
        });

        $(".message_reject_btn").on('click', function(e){
            var messageRejectBtnId = $(this).attr('id');
            var messageRejectBtnIdString = String(messageRejectBtnId);
            messageRejectBtnIdString = messageRejectBtnIdString.substring(messageRejectBtnIdString.indexOf('_') + 1);
            var messageIndexString = messageRejectBtnIdString.substring(0,messageRejectBtnIdString.indexOf('_'));



            console.log(messageIndexString);
            console.log(JSON.stringify(messageInfo[Number.parseInt(messageIndexString)]));
        });
    });    
});