$(document).ready(function(){
    $('#charge_btn').click(function(){
        if(userInfo == null || userInfo == undefined){
            bullup.alert("请您先登录!");
            return;
        }
        var chargeValue = $('#money').val();
        var value = parseInt(chargeValue);
        if(value == NaN){
            bullup.alert("请输入合法的充值金额!");
        }else if(value < 5){
            bullup.alert("最低充值金额为$5");
        }else{
            request.post('http://18.220.130.245:3001', {form:{rechargeAccount: value, userId: userInfo.userId}}, function(error, response, body){
                if(body == undefined){
                    bullup.alert('订单生产失败，请联系客服！');
                    return;
                }
                var bodyStartIndex = body.indexOf("<body>");
                var bodyEndIndex = body.indexOf("</body>");
                var htmlStr = body.substr(0, bodyEndIndex);
                htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
                $('#main-view').html(htmlStr);
                $('#recharge').modal('close');
            });
        }
    });    
});

