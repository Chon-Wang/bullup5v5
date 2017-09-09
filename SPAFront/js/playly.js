$().ready(function(){
    $('.play_href').on('click', function(e){
       
        e.preventDefault();
        douniu.loadTemplateIntoTarget('swig_team.html', {}, 'main-view');
		
        });
   
   
    });
   

    
  