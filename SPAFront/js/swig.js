var douniu = {};


douniu.loadSwigView = function (pageRef, data) {
	var	swig = require('swig');
	return swig.renderFile(pageRef, data || {});
}; // Loading views/swigTemplate.html 


// var template = myApp.loadSwigView('swig_test.html', {
// 	swigTest: 'awesome people',
// });
// $('#mainView').html(template);
