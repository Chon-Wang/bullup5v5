
$().ready(function(){
    $('#router_chat').on('click', function(e){
       
        e.preventDefault();
        douniu.loadTemplateIntoTarget('swig_playbyplay.html', {}, 'main-view');
        $.getScript('/js/playly.js');
      
        
	    });
        

	
    });
   

    