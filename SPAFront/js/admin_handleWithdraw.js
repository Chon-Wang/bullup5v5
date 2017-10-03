$('.agree').on('click', function(e){
    e.preventDefault();
    var getRow = $(this).closest('.keyRow');
    var data = $(getRow).find('.keyColumn').text();
    socket.emit('agree',{
        payId:data
    });
});

$('.disagree').on('click', function(e){
    e.preventDefault();
    var getRow = $(this).closest('.keyRow');
    var $data = $(getRow).find('.keyColumn').text();
    var $money = $(getRow).find('.money').text();
    var $userId = $(getRow).find('.userId').text();
    //alert($data+' '+$money+' '+$userId);
    socket.emit('disagree',{
        payId:$data,
        money:$money,
        userId:$userId
    });
});