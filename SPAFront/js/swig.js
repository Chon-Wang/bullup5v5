var bullup = {};


bullup.loadSwigView = function (pageRef, data) {
	var	swig = require('swig');
	return swig.renderFile(pageRef, data || {});
}; // Loading views/swigTemplate.html 

bullup.loadTemplateIntoTarget = function(pageRef, data, target){ //main-view
	var template = bullup.loadSwigView(pageRef, data);
	$('#' + target).html(template);
}

// var template = myApp.loadSwigView('swig_test.html', {
// 	swigTest: 'awesome people',
// });
// $('#mainView').html(template);
