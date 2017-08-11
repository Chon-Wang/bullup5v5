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

		var $userAccount = $('#usr_name').val();
		var $userPassword = $('#usr_pwd').val();
		var $confirmedPwd = $('#usr_repwd').val();
		var $userNickname = $('#usr_nick').val();
		var $tel = $('#usr_tel').val();
		var $email = $('#usr_email').val();

		if ($userPassword == $confirmedPwd) {
			socket.emit('register', {
				userAccount: $userAccount,
				userPassword: $userPassword,
				userNickname: $userNickname,
				userPhoneNumber: $tel,
				userEmail: $email
			});
		} else {
			alert('两次密码输入不一致!');
		}
	});
});
