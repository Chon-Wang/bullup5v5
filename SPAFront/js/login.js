// get username and user password
$().ready(function(){
	$('#login_btn').on('click', function(e){
		e.preventDefault();
		// get user name and user password
		var $log_name = $('#login_username').val();
		var $log_password = $('#login_password').val();
		socket.emit('login', {
			userName: $log_name,
			password: $log_password
		});
		//communicate with the server



		// get the log in result and render the page
		
	});
});
