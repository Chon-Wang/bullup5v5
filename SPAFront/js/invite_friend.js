$("#invite_friend_btn").click(function(){
    var friendListHeadHtml = douniu.loadSwigView('swig_friend_list_head.html', {
        user: userInfo
    });
    
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    $('#friend-list').collapsible();
    console.log(friendListHeadHtml);
    $("#user_view").html(friendListHeadHtml);

});
