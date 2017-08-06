var lolapi = require('lolutil.js');

$().ready(function () {
    $('#query_btn').on('click', function (e) {
		e.preventDefault();
        var summonerName = $('icon_prefix').value;
        lolapi.getBullupMatchDetailsBySummonerName(summonerName, function(matchDetails){
            var template = douniu.loadSwigView("swig_matches.html",matchDetails);
            $('#user-matches').html(template);
            $('#main-view').html($('#user-matches'));
            //douniu.loadSwigView("swig_match_detail.html",matchDetails);
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