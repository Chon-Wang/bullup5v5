
$().ready(function(){
    $('#router_index').on('click', function(e){
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
        $.getScript('/js/zymly.js');
        $.getScript('/js/payment.js');
        
	    });
        

	
    });
   

    
  
    
    