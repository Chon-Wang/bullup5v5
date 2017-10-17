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

		function verifyemail(str){  
			var reg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;  
			if( reg.test(str) ){  
				return true;  
			}else{  
				return false;  
			} 
		}
		function verifyHandset(str) {
			//中国手机号  
			var reg = /^(\+86)|(86)?1[3,5,8]{1}[0-9]{1}[0-9]{8}$/;  
			if( reg.test(str)) {  
				return true;  
			} else {  
				return false;  
			}
		}
		
		function verifyPassword(str) {
			//密码  
			var reg = /^([0-9]|[a-zA-Z]){6,16}$/;  
			if( reg.test(str)) {  
				return true;  
			} else {  
				return false;  
			}
		} 
		//alert($email);

		// function telephoneCheck(str) {
		// 	// 美国手机号
		// 	var reg = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/g;
		// 	return reg.test(str);

		// }
		// // telephoneCheck("555-555-5555");

		if(verifyemail($userAccount)==true){
			if(verifyHandset($tel)==true){
				if(verifyPassword($userPassword)==true){
					if ($userPassword == $confirmedPwd) {
						if($userNickname.length<=15){
							socket.emit('register', {
								userAccount: $userAccount,
								userPassword: $userPassword,
								userNickname: $userNickname,
								userPhoneNumber: $tel,
								userEmail: $email
							});
						}else{
							alert('昵称不得超过15字');
						}
					} else {
						alert("两次密码输入不一致!");
					}
				}else{
					alert('请输入6到16位的字母或者数字');
				}
			}else{
				alert('请输入正确的手机号码')
			}
		}else{
			alert('请输入正确的邮箱格式');
		}	
	});
});
