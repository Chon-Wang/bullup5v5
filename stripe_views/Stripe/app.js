var express = require('express');
var stripe = require('stripe')('sk_live_zrQoZpyN0MvLXDep0ESAhzHE');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine','hbs');
app.set('views',__dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
	res.render('index',{
	
	});
	console.log(11111);
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
})

/*
router.post('/payment',function(req,res,next){
	var stripeToken = req.body.stripeToken;
	var currentCharges = Math.round(req.body.stripeMoney * 100);
	stripe.customers.create({
		source:stripeToken,
	}).then(function(customer){
		return stripe.charges.create({
			amount:currentCharges,
			currency:'usd',
			customer:customer.id
		  });
		});
});
*/