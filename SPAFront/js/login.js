// get username and user password
$().ready(function () {
	$('#login_btn').on('click', function (e) {
		e.preventDefault();
		// get user name and user password
		var $log_name = $('#login_username').val();
		var $log_password = $('#login_password').val();
		//communicate with the server
		socket.emit('login', {
			userName: $log_name,
			password: $log_password
		});
		// get the log in result and render the page
	});


	$("#register_btn").on('click', function (e) {
		e.preventDefault();

		var $userName = $('#usr_name').val();
		var $password = $('#usr_pwd').val();
		var $confirmedPwd = $('#usr_repwd').val();
		var $tel = $('#usr_tel').val();
		var $email = $('#usr_email').val();

		if ($password == $confirmedPwd) {
			socket.emit('register', {
				userName: $userName,
				password: $password,
				tel: $tel,
				email: $email
			});
		} else {
			alert('两次密码输入不一致!');
		}
	});
});
