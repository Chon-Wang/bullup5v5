var inviteSelectedFriendBtnEvent = false;

$("#invite_friend_btn").click(function(){
    var friendListHeadHtml = bullup.loadSwigView('swig_friend_list_head.html', {
        user: userInfo
    });
    var friendListHtml = bullup.loadSwigView('swig_friend_list.html', {
        user: userInfo
    });
    $("#user_view").html(friendListHeadHtml);
    $('.friend-list').html(friendListHtml);
    if(!inviteSelectedFriendBtnEvent){
        inviteSelectedFriendBtnEvent = true;
        $("#invite_selected_friend_btn").click(function(){
            var friendListSize = Number.parseInt($("#friend_list_size_hidden").val());
            for(var i = 0;i<friendListSize;i++){
                if($("#friend_" + (i+1) + "_check_box").prop("checked")){//选中
                    //alert($("#friend_" + (i+1) + "_check_box").val());//打印选中的值
                    //发送请求
                    //console.log("room : " + JSON.stringify(roomInfo));
                    var friend = userInfo.friendList[$("#friend_" + (i+1) + "_check_box").val()];
                    socket.emit('message', {
                        name: friend.name,
                        userId: friend.userId,
                        messageText: "邀请组队",
                        messageType: "invitedFromFriend",
                        host: {
                            name: userInfo.name,
                            userId: userInfo.userId,
                        },
                        team: {
                            name: roomInfo.roomName,
                            bet: roomInfo.rewardAmount, // 赌注
                            mapId: roomInfo.mapSelection,
                            rule: roomInfo.winningCondition
                        }
                    });
                }
            }
        });
    }
   
});
