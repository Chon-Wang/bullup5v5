
$().ready(function(){
    //我发起的赛事路由
    $('.await_href').on('click', function(e){
       
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_launchevent.html', {}, 'main-view');
        
        $.getScript('/js/check.js');
    });
    //我参与的赛事路由
    $('.routing').on('click', function(e){
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_participateinevents.html', {}, 'main-view');
            
         $.getScript('/js/check.js');
     });
  });
   

     