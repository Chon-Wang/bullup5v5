

$('#sub_btn').on('click', function () {		
			console.log('进入聊天室');
			// $('#saytext').text('');
			var $Msg = document.getElementById('saytext').value;
			var $chatName=userInfo.name; 
			//communicate with the server
			socket.emit('chatMsg', {	
				chatMsg:$Msg,
				chatName:$chatName
			});
				
			  
		});
		socket.on('chatMsg', function(msg){
			  $('#messages').append($('<li class="chat-message" >').text(msg.chatName+':'+" "+msg.chatMsg));
				// $('#saytext').val("").focus();
			
	
});