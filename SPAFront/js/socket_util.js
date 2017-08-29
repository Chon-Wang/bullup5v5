var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');


var userInfo = null;
var teamInfo = null;
var roomInfo = null;
var versusLobbyInfo = null;
var battleInfo = null;
var messageInfo = [];


socket.on('success', function (data) {
    logger.listenerLog('success');
    console.log(data);
});


socket.on('feedback', function (feedback) {
    switch (feedback.type) {
        case 'LOGINRESULT':
            handleLoginResult(feedback);
            break;
        case 'REGISTERRESULT':
            userInfo = handleRegistResult(feedback);
            break;

        case 'ESTABLISHROOMRESULT':
            handleRoomEstablishmentResult(feedback);
            break;

        case 'INVITERESULT':
            handleFeedback(feedback);
            break;

        case 'VERSUSLOBBYINFO':
            versusLobbyInfo = handleFeedback(feedback);
            break;

        case 'TEAMDETAILS':
            var teamDetails = handleFeedback(feedback);
            //console.log(JSON.stringify(teamDetails, null, '\t'));
            break;

        // case 'INVITEBATTLERESULT':
        //     // 这里应该有一个自己的处理函数但是目前处理方式相同所以暂时用这个
        //     handlePersonalCenterResult(feedback);
        //     break;

        case 'STRENGTHRANKRESULT':
            var rankList = handleFeedback(feedback);
            handleRankList(rankList);
            break;

        case 'LOLBINDRESULT':
            handleLOLBindResult(feedback);
            break;

        case 'ESTABLISHTEAMRESULT':
            handleTeamEstablishResult(feedback);
            break;
        
        case 'REFRESHFORMEDBATTLEROOMRESULT':
            handleRefreshFormedBattleRoomResult(feedback);
            break;
       

        case 'PESONALCENTERRESULT':
            handlePersonalCenterResult(feedback);
            break;
        }
});

socket.on('message', function(message){
    
    switch(message.messageType){
        case 'invitedFromFriend':
            handleInviteFromFriend(message);
            break;
        case 'inviteBattle':
            handleBattleInviteRequest(message);
            break;
    }

});


// 监听服务端队伍信息更新
socket.on('teamInfoUpdate', function (data) {
    roomInfo = data;
    //console.log(JSON.stringify(roomInfo));
    //更新房间信息
    var roomInfoFrameHtml = douniu.loadSwigView('swig_myroom_frame.html', {});
    var roomInfoHtml = douniu.loadSwigView('swig_myroom_info.html', {
        room: roomInfo
    });
    var teamates = roomInfo.participants;
    var teamatesHtml = douniu.loadSwigView('swig_myroom_teamate.html', {
        teamates : teamates
    });
    $('.content').html(roomInfoFrameHtml);
    $('#team_info').html(roomInfoHtml);
    $('#teamates_info').html(teamatesHtml);
    
    if(userInfo.name == roomInfo.participants[0].name){
        //房主更新friendList
        $.getScript('/js/invite_friend.js');
        $('#invite_friend_btn').sideNav({
            menuWidth: 400, // Default is 300
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) {},
            onClose: function(el) {}
        });
    }else{
        //普通对员只显示队伍信息，没有好友邀请栏
        $('#invite_friend_btn').css('display', 'none');
        $('#confirm_create_team_btn').css('display', 'none');
    }

    $('#message_center_nav').click();
    // {"roomName":"嵇昊雨1503584960077","captain":{"name":"嵇昊雨","userId":30,"avatarId":1},"participants":[{"name":"嵇昊雨","userId":30,"avatarId":1,"strength":{"kda":"0.0","averageGoldEarned":0,"averageTurretsKilled":0,"averageDamage":0,"averageDamageTaken":0,"averageHeal":0,"score":2000}},{"name":"嵇昊雨","userId":30,"avatarId":1,"strength":{"kda":"0.0","averageGoldEarned":0,"averageTurretsKilled":0,"averageDamage":0,"averageDamageTaken":0,"averageHeal":0,"score":2000}}],"status":"ESTABLISHING","gameMode":"battle","battleDesc":"不服来战","rewardType":"bullupScore","rewardAmount":"10","mapSelection":"map-selection-1","winningCondition":"push-crystal"}

    // {"name":"嵇昊雨","userId":30,"avatarId":1,"wealth":0,"online":true,"status":"IDLE","friendList":{"郭景明":{"name":"郭景明","userId":29,"avatarId":1,"online":"true","status":"idle"},"嵇昊雨":{"name":"嵇昊雨","userId":30,"avatarId":1,"online":"true","status":"idle"}},"relationMap":{"currentTeamId":null,"currentGameId":null},"strength":{"kda":"0.0","averageGoldEarned":0,"averageTurretsKilled":0,"averageDamage":0,"averageDamageTaken":0,"averageHeal":0,"score":2000}}

    //var temp = douniu.loadSwigView("./swig_menu.html", { logged_user: userInfo });
});

socket.on('teamForm', function () {
    //TODO 切换到对战大厅
    socket.emit('versusLobbyRefresh');
});

socket.on('battleRequest', function (battleRequest) {
    // TODO 提示用户有对战邀请, 点击查看对方详情
});

socket.on('battleInfo', function (battle) {
    battleInfo = battle;
});

socket.on('lolRoomEstablish', function (lolRoom) {
    if (userInfo.userId == lolRoom.creatorId) {
        // 如果用户是创建者，则创建房间
        alert('请创建房间' + lolRoom.roomName);
    } else {
        // 如果不是创建者，则显示等待蓝方队长建立房间
        alert('请等待');
    }
});

socket.on('lolRoomEstablished', function () {
});

/**
 * 处理用户登录
 * @param {*} feedback 
 */
function handleLoginResult(feedback) {
    if (feedback.errorCode == 0) {
        // 登录成功
        alert(feedback.text);
        userInfo = feedback.extension;
        //console.log(JSON.stringify(userInfo));
        //跳转
        var temp = douniu.loadSwigView("./swig_menu.html", { logged_user: userInfo });
        // 关闭
        $("#log_modal").css("display", "none");
        $('#dropdown_menu').html(temp);
        $('#log_modal').modal('close');
        $('.modal-overlay').remove();
        $("#log_out_button").on('click', function(e){
		    alert('登出成功!');
            e.preventDefault();
            userInfo = null;
            var temp = douniu.loadSwigView("./swig_menu.html", null);
            // 打开
            $("#log_modal").css("display", "block");
            $('#dropdown_menu').html(temp);
        });
    } else if (feedback.errorCode == 1) {
        // 登录失败
        alert(feedback.text);
    }
}

function handleFeedback(feedback) {
    if (feedback.errorCode == 0) {
        if (feedback.text) 
            //alert(feedback.text);
            console.log(feedback.text);
        return feedback.extension;
    } else {
        alert(feedback.text);
    }
}

function handleRankList(rankList){
    var strengthRankList = rankList.strengthRankList;
    var wealthRankList = rankList.wealthRankList;
    var strengthArray = new Array();
    for(obj in strengthRankList){
        strengthArray.push(strengthRankList[obj]);
    }
    strengthArray.sort(function(x,y){
        return x.user_strength < y.user_strength ? 1 : -1;
    });
    var wealthArray = new Array();
    for(obj in wealthRankList){
        wealthArray.push(wealthRankList[obj]);
    }
    wealthArray.sort(function(x,y){
        return x.user_wealth < y.user_wealth ? 1 : -1;
    });
    
    var rank_list = douniu.loadSwigView('swig_rank.html', {
        strengthRankList: strengthArray,
        wealthRankList: wealthArray
    });
    $('.content').html(rank_list);
    $('ul.tabs').tabs();
}

function handleLOLBindResult(feedback){
    alert(feedback.extension.tips);
}

function handleRegistResult(feedback){
    alert(feedback.text);
    $('#sign_modal').modal('close');
    $('.modal-overlay').remove();
    return feedback.extension;
}

function handleRoomEstablishmentResult(feedback){
    if(feedback.errorCode == 0){
        alert(feedback.text);
    }else{
        alert("服务器错误,创建失败");
        return;
    }
    roomInfo = feedback.extension;
    var roomInfoFrameHtml = douniu.loadSwigView('swig_myroom_frame.html', {});
    var roomInfoHtml = douniu.loadSwigView('swig_myroom_info.html', {
        room: roomInfo
    });
    var teamates = [];
    var captain = roomInfo.captain;
    teamates.push(captain);
    var teamatesHtml = douniu.loadSwigView('swig_myroom_teamate.html', {
        teamates : teamates
    });
    $('.content').html(roomInfoFrameHtml);
    $('#team_info').html(roomInfoHtml);
    $('#teamates_info').html(teamatesHtml);
    $('#create_room_modal').modal('close');
    $.getScript('/js/invite_friend.js');

    $('#invite_friend_btn').sideNav({
        menuWidth: 400, // Default is 300
        edge: 'right', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
        onOpen: function(el) {},
        onClose: function(el) {}
    });

    $("#confirm_create_team_btn").click(function(){
		console.log(roomInfo);
		socket.emit('establishTeam', roomInfo);
	});

}

function handleTeamEstablishResult(feedback){
    if(feedback.errorCode == 0){
        alert(feedback.text);
        teamInfo = feedback.extension.teamInfo;
        var formedTeams = feedback.extension.formedTeams;
        delete formedTeams[teamInfo.roomName];
        for(var team in formedTeams){
            formedTeams[team].participantCount = formedTeams[team].participants.length;
        }
        var battle_teams = douniu.loadSwigView('swig_battle.html', {
			teams: formedTeams
		});
        //页面跳转到对战大厅
        $('.content').html(battle_teams);
		$('#team-detail-modal').modal();
		$('#waiting-modal').modal();
        $.getScript('./js/close_modal.js');
        $.getScript('./js/refresh_formed_room.js');
        $(".team_detail_btn").unbind();
        $(".team_detail_btn").click(function(){
            var btnId = $(this).attr('id');
            var roomName = btnId.substring(0, btnId.indexOf('_'));
            var room = null;
            for(var team in formedTeams){
                if(formedTeams[team].roomName == roomName){
                    room = formedTeams[team];
                    break;
                }
            }
            var teamDetailsHtml = douniu.loadSwigView('swig_team_detail.html', {
                team: room
            });
            $('#team_detail_container').html(teamDetailsHtml);
            location.hash = "#team-detail-modal";
            ///////////untest
            $('#invite-battle-btn').unbind();
            $('#invite-battle-btn').click(function(){
                var battleInfo = {};
                battleInfo.hostTeamName = $('#team_details_team_name').html();
                battleInfo.challengerTeamName = teamInfo.roomName;
                battleInfo.userId = userInfo.userId;
                socket.emit('battleInvite', battleInfo);
            });
            //////////
        });
		var pages = {
			totalPage: 10,
	 		pageNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	 		currentPage: 1
		};
		//
		var pagination = douniu.loadSwigView('swig_pagination.html', pages);
		//		console.log(pagination);
		$('#pagination-holder').html(pagination);


    }else{
        alert(feedback.text);
    }
}

function handleRefreshFormedBattleRoomResult(feedback){
    if(feedback.errorCode == 0){
        //alert(feedback.text);
        var formedTeams = feedback.extension.formedTeams;
        delete formedTeams[teamInfo.roomName];
        for(var team in formedTeams){
            formedTeams[team].participantCount = formedTeams[team].participants.length;
        }
        var battle_teams = douniu.loadSwigView('swig_battle.html', {
			teams: formedTeams
		});
        //页面跳转到对战大厅
        $('.content').html(battle_teams);
		$('#team-detail-modal').modal();
		$('#waiting-modal').modal();
        $.getScript('./js/close_modal.js');
        $.getScript('./js/refresh_formed_room.js');
        $(".team_detail_btn").unbind();
        $(".team_detail_btn").click(function(){
            var btnId = $(this).attr('id');
            var roomName = btnId.substring(0, btnId.indexOf('_'));
            var room = null;
            for(var team in formedTeams){
                if(formedTeams[team].roomName == roomName){
                    room = formedTeams[team];
                    break;
                }
            }
            var teamDetailsHtml = douniu.loadSwigView('swig_team_detail.html', {
                team: room
            });
            $('#team_detail_container').html(teamDetailsHtml);
            location.hash = "#team-detail-modal";
            ///////////untest
            $('#invite-battle-btn').unbind();
            $('#invite-battle-btn').click(function(){
                var battleInfo = {};
                battleInfo.hostTeamName = $('#team_details_team_name').html();
                battleInfo.challengerTeamName = teamInfo.roomName;
                battleInfo.userId = userInfo.userId;
                socket.emit('battleInvite', battleInfo);
            });
            //////////
        });
		var pages = {
			totalPage: 10,
	 		pageNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	 		currentPage: 1
		};
		//
		var pagination = douniu.loadSwigView('swig_pagination.html', pages);
		//		console.log(pagination);
		$('#pagination-holder').html(pagination);


    }else{
        alert(feedback.text);
    }   
}

function handleInviteFromFriend(message){
    //把收到的邀请添加到消息队列
    messageInfo.push(message);
    //弹出消息中心
    $("#message_center_nav").click();
    //console.log("messageInfo:  " + JSON.stringify(messageInfo));
}  


function  handlePersonalCenterResult(feedback){
    //判断是否成功
    if(feedback.errorCode == 0){
        var data = feedback.extension;
        console.log('data='+JSON.stringify(data));
         //取数据
        //渲染
        var personalCenterHtml = douniu.loadSwigView('./swig_personal_basic.html',{
            player:{
               name:data.UserlolNickname,
               server:data.UserlolArea
            }

        });
        $('#main-view').html(personalCenterHtml);
    }else{
        
    
    alert('加载页面失败');
    }
   
}

function handleBattleInviteRequest(message){
    messageInfo.push(message);
    //弹出消息中心
    $("#message_center_nav").click();
}

