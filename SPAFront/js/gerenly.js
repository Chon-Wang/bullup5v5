
$().ready(function(){
    $('#router_index').on('click', function(e){
        e.preventDefault();
        if(userInfo == null){
            bullup.alert('请先登录！');
        }else{
            var $role = userInfo.userRole;
            //alert($role);
            if($role==1){
                bullup.loadTemplateIntoTarget('swig_admin.html', {}, 'main-view');
                $.getScript('/js/zymly.js');
                
            }else{
                bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
                $.getScript('/js/zymly.js');
                var $userId = userInfo.userId;
                socket.emit('getBalance',{
                    userId:$userId
                });            
            }
        }
	});
});

   

    
  
    
    