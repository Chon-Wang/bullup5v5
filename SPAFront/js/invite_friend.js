$("#invite_friend_btn").click(function(){
    var friendListHeadHtml = douniu.loadSwigView('swig_friend_list_head.html', {
        user: userInfo
    });
    var friendListHtml = douniu.loadSwigView('swig_friend_list.html', {
        user: userInfo
    });


    

    //不好用
    $("#user_view").html(friendListHeadHtml);
    $('.friend-list').html(friendListHtml);
});
