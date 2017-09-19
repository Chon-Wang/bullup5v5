
$().ready(function(){
    $('.registration').on('click', function(e){
       
        e.preventDefault();
        //报名中路由
        bullup.loadTemplateIntoTarget('swig_signup.html', {}, 'main-view');
      
       
     });
     $('.underway').on('click', function(e){
        
         e.preventDefault();
         //进行中路由
         bullup.loadTemplateIntoTarget('swig_playbyplay.html', {}, 'main-view');
         $.getScript('/js/createateam.js');
        
      });
      $('.await').on('click', function(e){
        
         e.preventDefault();
         //等待报名路由
         bullup.loadTemplateIntoTarget('swig_waittosignup.html', {}, 'main-view');
      
        
      });
      $('.awaygame').on('click', function(e){
        
         e.preventDefault();
         //等待比赛路由
         bullup.loadTemplateIntoTarget('swig_await.html', {}, 'main-view');
         $.getScript('/js/createateam.js');
        
      });
      $('.finish').on('click', function(e){
        
         e.preventDefault();
         //已结束路由
         bullup.loadTemplateIntoTarget('swig_finished.html', {}, 'main-view');
         $.getScript('/js/createateam.js');
        
      });
      $('.personnelaudit').on('click', function(e){
        
         e.preventDefault();
         //报名审核理由
         bullup.loadTemplateIntoTarget('swig_audit.html', {}, 'main-view');
        
        
      });
    });
   

     