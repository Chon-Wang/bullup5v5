var douniu = {};


douniu.loadSwigView = function (pageRef, data) {
	var	swig = require('swig');
	return swig.renderFile(pageRef, data || {});
}; // Loading views/swigTemplate.html 

douniu.loadTemplateIntoTarget = function(pageRef, data, target){ //main-view
	var template = douniu.loadSwigView(pageRef, data);
	$('#' + target).html(template);
}

// var template = myApp.loadSwigView('swig_test.html', {
// 	swigTest: 'awesome people',
// });
// $('#mainView').html(template);
