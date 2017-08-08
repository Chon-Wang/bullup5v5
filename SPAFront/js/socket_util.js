var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000');


var userInfo = null;
var teamInfo = null;
var inviteInfo = null;
var versusLobbyInfo = null;
var battleInfo = null;


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
            userInfo = handleFeedback(feedback);
            console.log(JSON.stringify(userInfo, null, '\t'));
            break;

        case 'ESTABLISHTEAMRESULT':
            teamInfo = handleFeedback(feedback);
            console.log(JSON.stringify(teamInfo, null, '\t'));
            break;

        case 'INVITERESULT':
            handleFeedback(feedback);
            break;

        case 'VERSUSLOBBYINFO':
            versusLobbyInfo = handleFeedback(feedback);
            break;

        case 'TEAMDETAILS':
            var teamDetails = handleFeedback(feedback);
            console.log(JSON.stringify(teamDetails, null, '\t'));
            break;

        case 'INVITEBATTLERESULT':
            // 这里应该有一个自己的处理函数但是目前处理方式相同所以暂时用这个
            handleFeedback(feedback);
            break;

        case 'STRENGTHRANKRESULT':
            var rankList = handleFeedback(feedback);
            handleRankList(rankList);
        }
});

socket.on('friendInvitation', function (invitePacket) {
    console.log("In friendInvitation listener!");
    // TODO 获取邀请者信息, 选择是否接受邀请
    inviteInfo = invitePacket;
});

// 监听服务端队伍信息更新
socket.on('teamInfoUpdate', function (data) {
    teamInfo = data;
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
    } else {
        // 如果不是创建者，则显示等待蓝方队长建立房间
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
