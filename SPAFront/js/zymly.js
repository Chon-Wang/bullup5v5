$().ready(function(){
    $('.tix').on('click', function(e){
       
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_recharge.html', {}, 'main-view');
        });
   
     $('.zjin').on('click', function(e){
             e.preventDefault();
             bullup.loadTemplateIntoTarget('swig_basic_table.html', {}, 'main-view'); 
             });
            
     $('.gengg').on('click', function(e){  
            e.preventDefault();
            bullup.loadTemplateIntoTarget('swig_form_component.html', {}, 'main-view'); 
        });
});
   

    
  
    
  