var stripe = require("stripe")( "sk_test_ud0FTgDIp5a5SLWZMMOGvVF9");
var logger = require('../util/logutil');
var socketProxy = require('./socketproxy.js');
var dbUtil = require('../util/dbutil.js');
var logger = require('../util/logutil.js');

exports.init = function () {
   
}
/**
 * 充值申请
 */
exports.handlePayment = function (socket) {
    socket.on('payment',function(data){
        var  token = data.token;
        var amount = data.money;
        logger.listenerLog('payment');
        console.log('------------------------------')
        console.log('payment');
        console.log('------------------------------')
        console.log(data);
        console.log('------------------------------')
        console.log(amount);
        console.log('-------------------------------')
            stripe.charges.create({
                amount: amount*1000,
                currency: "usd",
                description: "Example charge",
                source: "tok_mastercard",
            }, function(err, charge) {
        // asynchronously called
                console.log(charge)
                console.log('------------------------------')
                console.log(err)
                console.log('------------------------------')
                console.log(token)
                console.log(token.length)
        });
    })
}
/**
 * 收集支付信息
 * @param socket
*/
exports.handleBankInfo = function (socket) {
    socket.on('bankInfo', function (bank) {
        console.log('bankInfo:'+bank.firstname);
        logger.listenerLog('changeInfo');
        dbUtil.insertBankInfo(bank,function(res){
            if (!res) {
                socketProxy.stableSocketEmit(socket, 'feedback', {
                    errorCode: 1,
                    text: '修改失败，请稍后重试',
                    type: 'PAYMENTRESULT',
                    extension: null
                });
            } else {
                socketProxy.stableSocketEmit(socket, 'feedback', {
                    errorCode: 0,
                    text: '修改成功',
                    type: 'PAYMENTRESULT',
                    extension: {
                        //userAccount: userInfo.userAccount,
                        //userNickname: userInfo.userNickname,
                        //userId: userAddRes.userId,
                        //userIconId: 1,
                    }
                });
            }
        });
    });
}
