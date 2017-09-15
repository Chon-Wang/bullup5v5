

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
			$('#saytext').val('');	  
		});
		 
		socket.on('chatMsg', function(msg){
			if(msg.chatId==userInfo.userId){
				$('#messages').append($('<li class="chat-message " style="width:88%;padding: 15px; margin: 5px 10px 0;  border-radius: 10px; font-size: 18px;background:  #b3ade9;color: #fff;float:right;" >').text(msg.chatName+':'+" "+msg.chatMsg));
				
			}else{
				$('#messages').append($('<li class="friend-messages"  style="width:88%;padding: 15px; margin: 5px 10px 0;  border-radius: 10px; font-size: 18px;;background: #009fab;color: #fff;float:left;"  >').text(msg.chatName+':'+" "+msg.chatMsg));
			}
			
	
});