var inviteSelectedFriendBtnEvent = false;

$("#invite_friend_btn").click(function(){
    var friendListHeadHtml = douniu.loadSwigView('swig_friend_list_head.html', {
        user: userInfo
    });
    var friendListHtml = douniu.loadSwigView('swig_friend_list.html', {
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
                    alert($("#friend_" + (i+1) + "_check_box").val());//打印选中的值
                }
            }
        });
    }
   
});
