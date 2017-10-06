$().ready(function(){
    $('.moda-img').on('click', function (e) {
        var modai = $(this).index();
        var modimg = $('.moda img').eq(modai).attr('src'); 
        console.log(modimg);
    });
})
