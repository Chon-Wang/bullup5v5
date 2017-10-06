$().ready(function(){
    $('.moda li').on('click', function () {
        var modai = $(this).index();
        var modimg = $('.moda img').eq(modai).attr('src'); 
        console.log(modimg);
    });
})
