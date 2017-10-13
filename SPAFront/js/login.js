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
		var agreeRules = $('#filled-in-box').is(':checked');
		if(agreeRules != true){
			bullup.alert("请仔细阅读并同意用户协议！");
			return;
		}
		if($userAccount == ""){
			bullup.alert("请输入邮箱！");
			return;
		}
		if($userPassword == ""){
			bullup.alert("请输入密码！");
			return;
		}
		if($confirmedPwd == ""){
			bullup.alert("请再次输入密码！");
			return;
		}
		if($userNickname == ""){
			bullup.alert("请输入用户昵称！");
			return;
		}
		if($tel== ""){
			bullup.alert("请输入手机号！");
			return;
		}
		if($email == ""){
			bullup.alert("请输入邀请码！");
			return;
		}
		if ($userPassword == $confirmedPwd) {
			socket.emit('register', {
				userAccount: $userAccount,
				userPassword: $userPassword,
				userNickname: $userNickname,
				userPhoneNumber: $tel,
				userEmail: $email
			});
			$("#sign_modal").modal("close");
			$('.modal-overlay').remove();
		} else {
			bullup.alert("两次密码输入不一致!");
		}
	});
});
