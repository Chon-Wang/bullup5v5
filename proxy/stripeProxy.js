var express = require('express');
var stripe = require('stripe')('sk_live_zrQoZpyN0MvLXDep0ESAhzHE');
var bodyParser = require('body-parser');

var app = express();
var fs = require("fs");


exports.recharge = function(){
    app.set('view engine','hbs');
    app.set('views',__dirname + '/views');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    
    app.get('/',function(req,res){
        var rechargeValue = parseInt(req.url.substr(req.url.indexOf('=') + 1));
        var data = fs.readFileSync('./stripe_views/index.hbs').toString();
        data = data.replace("aaaaa", String(rechargeValue));
        data = data.replace("aaaaaa", String(rechargeValue));
        fs.writeFileSync('./stripe_views/temp.hbs', data);
        res.sendFile('C:/Users/Administrator/Desktop/bullup5v5/stripe_views/temp.hbs');
        //res.sendFile('C:/Users/JM.Guo/Desktop/Stripe/views/index.hbs');
    });
    
    
    app.post("/charge",function(req,res){
        console.log(1111);
        var token = req.body.stripeToken;
        var chargeAmount = req.body.chargeAmount;
        console.log(token);
        var charge = stripe.charges.create({
            amount:chargeAmount,
            currency:'usd',
            source:token,
        });
        console.log('you payment was successed!')
        //res.redirect('/')
    });
    
    
    app.listen(3001,function(){
        console.log('stripe is running');
    });
}

