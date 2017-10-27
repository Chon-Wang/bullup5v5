var express = require('express');
var stripe = require('stripe')('sk_live_zrQoZpyN0MvLXDep0ESAhzHE');
var bodyParser = require('body-parser');
var dbUtil = require('../util/dbutil.js');
var socketProxy = require('../proxy/socketProxy');

var app = express();
var fs = require("fs");


exports.recharge = function(){
    app.set('view engine','hbs');
    app.set('views',__dirname + '/views');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    
    app.post('/',function(req,res){
        //var str = req.url.substr(req.url.indexOf('?'), req.url.indexOf('=') - req.url.indexOf('?'));
        var rechargeValue = req.body.rechargeAccount;
        var userId = req.body.userId;
        var data = fs.readFileSync('./stripe_views/index.hbs').toString();
        data = data.replace("chargeAmountValue", String(Number.parseInt(rechargeValue) * 100));
        data = data.replace("chargeAmountValueHidden", String(Number.parseInt(rechargeValue) * 100));
        data = data.replace("userNameValue", String(userId));
        fs.writeFileSync('C:/Users/Administrator/Desktop/bullup5v5/stripe_views/temp.hbs', data);
        //每次合并代码应将此路径改为自己的
        res.sendFile('C:/Users/Administrator/Desktop/bullup5v5/stripe_views/temp.hbs');
        //res.sendFile('C:/Users/JM.Guo/Desktop/Stripe/views/index.hbs');
    });
    
    
    app.post("/charge",function(req,res){
        var body = req.body;
        var token = req.body.stripeToken;
        var chargeAmount = req.body.chargeAmount;
        var userId = req.body.userName;
        console.log(token);
        var charge = stripe.charges.create({
            amount:chargeAmount,
            currency:'usd',
            source:token,
        });
        var data = {};
        data.userId = Number.parseInt(userId);
        data.money = Number.parseInt(chargeAmount) / 100;
        data.currency = 'dolla';
        dbUtil.userRecharge(data, function(results){
            var socket = socketProxy.mapUserIdToSocket(data.userId);
            if(results != null){
                socketProxy.stableSocketEmit(socket, "rechargeResult", {'text': '充值成功！'});
            }else{
                socketProxy.stableSocketEmit(socket, "rechargeResult", {'text': '充值失败！请联系客服！'});
            }
        });
    });
    
    
    app.listen(3001,function(){
        console.log('stripe is running');
    });
}

