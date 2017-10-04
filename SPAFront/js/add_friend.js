$().ready(function(){
    $('#friend_list_btn').on('click', function(e){
        if(userInfo == null){
            bullup.alert("请您先登录");
        }else{
            var friendCount = 0;
            for(var index in userInfo.friendList){
                friendCount++
            }
            bullup.loadTemplateIntoTarget('swig_home_friendlist.html', {
                'userInfo': userInfo,
                'friendListLength': friendCount
            }, 'user-slide-out');
        }
    });

    $('#confirm_add_friend_btn').on('click', function(e){
        
    });
});