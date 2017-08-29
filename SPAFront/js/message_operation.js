$(".message_accept_btn").unbind();
$(".message_accept_btn").on('click', function(e){
    
    var messageAcceptBtnId = $(this).attr('id');
    var messageAcceptBtnIdString = String(messageAcceptBtnId);
    messageAcceptBtnIdString = messageAcceptBtnIdString.substring(messageAcceptBtnIdString.indexOf('_') + 1);
    var messageIndexString = messageAcceptBtnIdString.substring(0,messageAcceptBtnIdString.indexOf('_'));
    var message = messageInfo[Number.parseInt(messageIndexString)];

    switch(message.messageType){
        case 'invitedFromFriend':{
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
            break;
        }

        case 'inviteBattle':{
            var inviteBattleResult = {
                errorCode: 0,
                type: 'INVITEBATTLERESULT',
                text: '',
                extension: {
                    hostTeam: message.hostTeam,
                    challengerTeam: message.team
                }
            }
            socket.emit('inviteBattleResult', inviteBattleResult);
            //删除消息
            messageInfo.splice(Number.parseInt(messageIndexString), 1);
            break;
        }
    }

});


$(".message_reject_btn").unbind();
$(".message_reject_btn").on('click', function(e){
    var messageRejectBtnId = $(this).attr('id');
    var messageRejectBtnIdString = String(messageRejectBtnId);
    messageRejectBtnIdString = messageRejectBtnIdString.substring(messageRejectBtnIdString.indexOf('_') + 1);
    var messageIndexString = messageRejectBtnIdString.substring(0,messageRejectBtnIdString.indexOf('_'));
    var message = messageInfo[Number.parseInt(messageIndexString)];
   
    switch(message.messageType){
        case 'invitedFromFriend':{
            var inviteResult = {
                errorCode: 1,
                type: 'INVITERESULT',
                text: userInfo.name + '拒绝了您的邀请',
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
            break;
        }
    }
});