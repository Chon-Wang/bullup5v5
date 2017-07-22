// get username and user password
$().ready(function(){
	$('#login_btn').on('click', function(e){
		e.preventDefault();
		// get user name and user password
		var $log_name = $('#login_username').val();
		var $log_password = $('#login_password').val();
		alert($log_name);
		alert($log_password);

		//communicate with the server
		



		// get the log in result and render the page
		
		
	});
});
