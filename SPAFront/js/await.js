
$().ready(function(){
    $('.await_href').on('click', function(e){
       
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_await.html', {}, 'main-view');
        //动态加载查看队员子页面路由js
        $.getScript('/js/check.js');
      
       
      
        
	    });
        

	
    });
   

     