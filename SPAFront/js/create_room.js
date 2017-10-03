$(document).ready(function(){

	$("#create_room").click(function(){
		$("#create_room_modall").css("display","block");

		var dateTime = new Date($.now());

		$("#create_date_time").text(dateTime);
	});

	$("#create_close").click(function(){
		$("#create_room_modall").css("display", "none");
	});


	$("#confirm_create_room_btn").click(function(){
		if(userInfo == null){
			alert('请您先登录');
			return;
		}

		if(roomInfo != null){
			alert("您已经加入了房间,无法创建新的房间！");
			return ;
		}
		var room = {
			battleDesc : $("#battle_desc").val(),
			mapSelection : "map-selection-1",
			winningCondition : "push-crystal",
			gameMode : $("#game_mode").val(),
			rewardType : $("#reward_type").val(),
			rewardAmount : $("#reward_amount").val()
		}
		socket.emit('roomEstablish', {
			roomName: userInfo.name + (new Date).valueOf(),
			captain: {
				name: userInfo                                                                                                                                                                       .name,
				userId: userInfo.userId,
				avatarId: userInfo.avatarId
			},
			participants: [
				{
					name: userInfo.name,
					userId: userInfo.userId,
					avatarId: userInfo.avatarId,
					strength: userInfo.strength,
					lolAccountInfo: userInfo.lolAccountInfo
				}
			],
			status: 'ESTABLISHING',
			gameMode: room.gameMode,
			battleDesc: room.battleDesc,
			rewardType : room.rewardType,
			rewardAmount: room.rewardAmount,
			mapSelection: room.mapSelection,
			winningCondition: room.winningCondition
		});
	});

});
