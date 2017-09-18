

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
			if(msg.chatId==userInfo.userId){
				$('#messages').append($('<li class="chat-message " style="background:  #b3ade9;color: #fff;float:right;" >').text(msg.chatName+':'+" "+msg.chatMsg));
			}else{
				$('#messages').append($('<li class="friend-messages"  style="background: #009fab;color: #fff;float:left;"  >').text(msg.chatName+':'+" "+msg.chatMsg));
			}

	
});