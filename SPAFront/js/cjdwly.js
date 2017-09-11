
$().ready(function(){
    $('#router_chat').on('click', function(e){
       
        e.preventDefault();
        douniu.loadTemplateIntoTarget('chatroom.html', {}, 'main-view');
        $.getScript('/js/playly.js');
      
        
	    });
        

	
    });
   

    