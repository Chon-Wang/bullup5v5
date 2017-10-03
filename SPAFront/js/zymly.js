$().ready(function(){

    $('.zjin').on('click', function(e){
        e.preventDefault();
        var $userId = userInfo.userId;
        //alert($userId);
        socket.emit('cashFlow',{
            userId:$userId
        });
        //bullup.loadTemplateIntoTarget('swig_basic_table.html', {}, 'main-view');       
    });

    $('.gengg').on('click', function(e){
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_form_component.html', {}, 'main-view');           
    });
});
   

    
  
    
  