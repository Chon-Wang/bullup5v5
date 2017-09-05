$(document).ready(function(){
    $("#router_test_page").click(function(e){
        var testDataString = '{"battleName":"嵇昊雨郭景明1504507131239","blueSide":{"roomName":"嵇昊雨1504507111851","captain":{"name":"嵇昊雨","userId":30,"avatarId":1},"participants":[{"name":"嵇昊雨","userId":30,"avatarId":1,"strength":{"kda":"0.0","averageGoldEarned":0,"averageTurretsKilled":0,"averageDamage":0,"averageDamageTaken":0,"averageHeal":0,"score":2000}}],"status":"PUBLISHING","gameMode":"battle","battleDesc":"","rewardType":"bullupScore","rewardAmount":"10","mapSelection":"map-selection-1","winningCondition":"push-crystal"},"redSide":{"roomName":"郭景明1504507072765","captain":{"name":"郭景明","userId":29,"avatarId":1},"participants":[{"name":"郭景明","userId":29,"avatarId":1,"strength":{"kda":"0.0","averageGoldEarned":0,"averageTurretsKilled":0,"averageDamage":0,"averageDamageTaken":0,"averageHeal":0,"score":2000}}],"status":"PUBLISHING","gameMode":"battle","battleDesc":"","rewardType":"bullupScore","rewardAmount":"10","mapSelection":"map-selection-1","winningCondition":"push-crystal"},"status":"unready","time":{"unready":"20170904143851","ready":null,"start":null}}';
        var testData = JSON.parse(testDataString);
        var battleRoomHtml = douniu.loadSwigView("./swig_fight.html", {
            blueSide: testData.blueSide,
            redSide: testData.redSide,
        });
        //样式参考
        //var battleRoomHtml = douniu.loadSwigView("./spa_fight.html", {});
        $('#main-view').html(battleRoomHtml);
        $('#waiting-modal').css('display', 'none');    
        $('#team-detail-modal').css('display', 'none');    
        $('.modal-overlay').remove();
    });
});