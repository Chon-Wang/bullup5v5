var lolapi = require('./js/lolutil.js');


process.on('uncaughtException', function(err) {
    //alert("召唤师不存在或设置的时间段过长！");
    console.log(String(err));
});

$().ready(function () {
    $('#query_btn').on('click', function (e) {
        e.preventDefault();
        var summonerName = $('#query_summoner_name').val();
        if(summonerName == ""){
            bullup.alert("请输入召唤师的名字");
            return;
        }
        var startDate = $('#query_start_data').val();
        if(startDate == ""){
            bullup.alert("请输入起始时间");
            return;
        }
        var endDate = $('#query_end_data').val();
        if(endDate == ""){
            bullup.alert("请输入终止时间");
            return;
        }
        bullup.alert("正在查询对战记录，请稍等");
        var strs = startDate.split(",");
        var year = strs[1];
        var day = strs[0].split(" ")[0];
        var month = strs[0].split(" ")[1];
        switch(month){
            case 'January': month="1"; break;
            case 'February': month="2"; break;
            case 'March': month="3"; break;
            case 'April': month="4"; break;
            case 'May': month="5"; break;
            case 'June': month="6"; break;
            case 'July': month="7"; break;
            case 'August': month="8"; break;
            case 'September': month="9"; break;
            case 'October': month="10"; break;
            case 'November': month="11"; break;
            case 'December': month="12"; break;
            default: month="1"; break;
        }
        startDate = year + "/" + month + "/" + day;

        strs = endDate.split(",");
        year = strs[1];
        day = strs[0].split(" ")[0];
        month = strs[0].split(" ")[1];
        switch(month){
            case 'January': month="1"; break;
            case 'February': month="2"; break;
            case 'March': month="3"; break;
            case 'April': month="4"; break;
            case 'May': month="5"; break;
            case 'June': month="6"; break;
            case 'July': month="7"; break;
            case 'August': month="8"; break;
            case 'September': month="9"; break;
            case 'October': month="10"; break;
            case 'November': month="11"; break;
            case 'December': month="12"; break;
            default: month="1"; break;
        }
        endDate = year + "/" + month + "/" + day;
        lolapi.getMatchDetailsBySummonerName(summonerName, startDate, endDate, function(matchDetails){
            if(matchDetails == null || matchDetails == undefined){
                bullup.alert("召唤师不存在或设置的时间段过长！");
                return;
            }else{
                var frame = bullup.loadSwigView("swig_queryres.html", {});
                var leftTemplate = bullup.loadSwigView("swig_matches.html",matchDetails);
                globalMatchDetails = matchDetails;
                $('.content').html(frame);
                $('#user-matches').html(leftTemplate);
                $('.match-item').on('click', function(e){
                    var htmlId = $(this).attr('id');
                    var index = String(htmlId).substring(0, 1);
                    var rightTemplate = bullup.loadSwigView("swig_match_detail.html", {
                        match: matchDetails.matches[index - 1],
                    });
                    $('#match_wrapper').html(rightTemplate); 
                });
            }
        });
    });
});

// {
//     "matches" : [
//         {
//             "name" : "Who is 55Kai",
//             "championId" : "1",
//             "championName" : "黑暗之女",
//             "gameMode" : "CLASSIC",
//             "gameType" : "MATCHED_GAME",
//             "time" : "2017-05-09 15:34:03",
//             "kda" : "13/0/9",
//             "win" : true,
//             "paticipants" : [
//                 {
//                     "name" : "Who is 55Kai",
//                     "kda" : "13/0/9",
//                     "kdaScore" : "13.5",
//                     "damage" : "20000",
//                     "damageTaken": "15000",
//                     "goldEarned" : "12000",
//                     "items" : {
//                         "item0" : 1,
//                         "item1" : 1,
//                         "item2" : 1,
//                         "item3" : 1,
//                         "item4" : 1,
//                         "item5" : 1,
//                         "item6" : 1
//                     }
//                 }
//                 ...
//             ]

//         }
//         ...
//     ]
// }