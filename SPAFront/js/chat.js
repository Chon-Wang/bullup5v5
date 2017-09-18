$('#sub_btn').unbind();
$('#sub_btn').on('click', function () {		
	if(userInfo == null){
		alert("请先登录");
		return ;
	}
	console.log('进入聊天室');
	// $('#saytext').text('')
	var $Msg = document.getElementById('saytext').value;
	var $chatName=userInfo.name; 
	//communicate with the server
	socket.emit('chatMsg', {	
		chatMsg:$Msg,
		chatName:$chatName
	});		
	$('#saytext').val('');
});