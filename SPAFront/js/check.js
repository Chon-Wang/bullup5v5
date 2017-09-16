
$().ready(function(){
    $('.check').on('click', function(e){
       
        e.preventDefault();
        //查看队员路由
        bullup.loadTemplateIntoTarget('checkthenumberofapplicants.html', {}, 'main-view');
      
       
     });
  });
   

     