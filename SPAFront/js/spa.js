var douniu = {};
douniu.loadView = function (pageRef, containerId, callbackName) {

	$(containerId).load(pageRef, function (response, status) {
		if (status == 'error') {
			console.warn('Could not load' + fileName);
		} else if (typeof douniu[callbackName] === 'function') {
			douniu[callbackName]($(this));
		}
	});
};

// load template file with url stored in pageRef
douniu.loadSwigView = function (pageRef, data) {
	var swig = require('swig');
	return swig.renderFile(pageRef, data || {});
};


$(document).ready(function () {
	$('.nav-link').on('click', function (e) {
		// prevent default event
		e.preventDefault();
		var pageRef = $(this).attr('href');
		//        douniu.loadView(pageRef, '.content', null);
		callPage(pageRef);
	});

	function callPage(pageRefInput) {
		$.ajax({
			url: pageRefInput,
			type: "GET",
			dataType: "text",
			success: function (response) {
				$('.content').html(response);
			},
			error: function (error) {
				console.log('the page was not loaded', error);
			},
			complete: function (xhr, status) {
				console.log('the request is complete');
			}
		});
	};

});

