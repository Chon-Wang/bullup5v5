$(document).ready(function(){
    $("#turn_to_room_btn").click(function(){
        if(battleInfo != null){
            //回到对战页面
            var battleRoomHtml = bullup.loadSwigView("./swig_fight.html", {
                blueSide: battleInfo.blueSide,
                redSide: battleInfo.redSide,
            });
            $('#main-view').html(battleRoomHtml);
            $('#waiting-modal').css('display', 'none');    
            $('#team-detail-modal').css('display', 'none');    
            $('.modal-overlay').remove();
        }else if(teamInfo != null){
            //回到对战大厅页面
            for(var team in formedTeams){
                formedTeams[team].participantCount = formedTeams[team].participants.length;
            }
            var battle_teams = bullup.loadSwigView('swig_battle.html', {
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
                var teamDetailsHtml = bullup.loadSwigView('swig_team_detail.html', {
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
            var pagination = bullup.loadSwigView('swig_pagination.html', pages);
            //		console.log(pagination);
            $('#pagination-holder').html(pagination);
        }else if(roomInfo != null){
            //回到房间页面
            var roomInfoFrameHtml = bullup.loadSwigView('swig_myroom_frame.html', {});
            var roomInfoHtml = bullup.loadSwigView('swig_myroom_info.html', {
                room: roomInfo
            });
            var teamates = [];
            var captain = roomInfo.captain;
            teamates.push(captain);
            var teamatesHtml = bullup.loadSwigView('swig_myroom_teamate.html', {
                teamates : teamates
            });
            $('.content').html(roomInfoFrameHtml);
            $('#team_info').html(roomInfoHtml);
            $('#teamates_info').html(teamatesHtml);
            $('#create_room_modall').modal('close');
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

    });
});