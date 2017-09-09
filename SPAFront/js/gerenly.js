
$().ready(function(){
    $('#router_index').on('click', function(e){
        e.preventDefault();
        douniu.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
        $.getScript('/js/zymly.js');
 
	    });
    });
   

    
  
    
    