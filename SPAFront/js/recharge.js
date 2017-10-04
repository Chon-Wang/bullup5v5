$('#charge_btn').on('click', function(e){
    var chargeValue = $('#money').val();
    var value = parseInt(chargeValue);
    if(value == NaN){
        bullup.alert("请输入合法的充值金额!");
    }else if(value < 10){
        bullup.alert("最低充值金额为$10");
    }else{
        options = {
            url: 'http://127.0.0.1:3001?rechargeAccount='+(value*100)
        };
        request(options, function(error, response, body){
            var bodyStartIndex = body.indexOf("<body>");
            var bodyEndIndex = body.indexOf("</body>");
            var htmlStr = body.substr(0, bodyEndIndex);
            htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
            $('#main-view').html(htmlStr);
            $('#recharge').css('display', 'none');
            $('.modal-overlay').remove();
        });
    }
});
