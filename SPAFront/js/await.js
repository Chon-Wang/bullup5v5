
$().ready(function () {
    //我发起的赛事路由
    $('.await_href').on('click', function (e) {

        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_launchevent.html', {}, 'main-view');
        socket.emit('initiate',{
            userId:userInfo.userId
        });
      
    });
    //我参与的赛事路由
    $('.routing').on('click', function (e) {
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_participateinevents.html', {}, 'main-view');
        socket.emit('joinMatch',{
            userId:userInfo.userId
        });
        $.getScript('/js/check.js');
    });
    //所有赛事路由
    $('.all_href').on('click', function (e) {
        e.preventDefault();
        bullup.loadTemplateIntoTarget('swig_allcompetition.html', {}, 'main-view');
        socket.emit('checkmatch',{
            userId:userInfo.userId
        });
    
        $.getScript('/js/check.js');
    })
});


