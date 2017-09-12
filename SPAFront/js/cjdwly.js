
$().ready(function(){
    $('#router_chat').on('click', function(e){
       
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_playbyplay.html', {}, 'main-view');
        $.getScript('/js/playly.js');
      
        
	    });
        

	
    });
   

    