var myApp = {};

myApp.loadSwigView = function (view, data) {
	var fileName = './' + view + '.html',
		swig = require('swig');
	return swig.renderFile(fileName, data || {});
}; // Loading views/swigTemplate.html 


var template = myApp.loadSwigView('swig_test', {
	swigTest: 'awesome people',
});
$('#mainView').html(template);
