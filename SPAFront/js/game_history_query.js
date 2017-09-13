var lolapi = require('./js/lolutil.js');


$().ready(function () {
    $('#query_btn').on('click', function (e) {
        var summonerName = $('#query_summoner_name').val();
        e.preventDefault();
        lolapi.getMatchDetailsBySummonerName(summonerName, '2017/8/1', '2017/8/4', function(matchDetails){
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