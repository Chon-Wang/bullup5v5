var request = require('request');
var async = require('async');

var apiKey =  "RGAPI-37683430-a2df-46fa-a006-60fff9f9aba7";

function getItemsStaticData(callback){
    var options = {
        url: 'https://na1.api.riotgames.com/lol/static-data/v3/items?locale=zh_CN',
        headers: {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": apiKey,
            "Accept-Language": "zh-CN,zh;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        }
    };
    request(options, function(error, response, body){
        bodyObj = JSON.parse(body);
        var dataObj = bodyObj.data;
        callback(dataObj);
    });
}

function getChampionsStaticData(callback){
    var options = {
        url: 'https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=zh_CN&dataById=true',
        headers: {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": apiKey,
            "Accept-Language": "zh-CN,zh;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        }
    };
    request(options, function(error, response, body){
        bodyObj = JSON.parse(body);
        var dataObj = bodyObj.data;
        callback(dataObj);
    });
}

function getSummonerByName(name, callback){
    var options = {
        url: 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+name,
        headers: {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": apiKey,
            "Accept-Language": "zh-CN,zh;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        }
    };
    async.waterfall([
        function(callback){
            request(options, function(error, response, body){
                bodyObj = JSON.parse(body);
                if(bodyObj.name != undefined){
                    callback(null, bodyObj);
                }else{
                    callback("404", null);
                }
            });
        }
    ], function (err, result) {
        if(err == null){
            callback(result);
        }else{
            callback(undefined);
        }

    });
}

function getRecentMatchesListByAccountId(accountId, callback){
    var options = {
        url: 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '/recent',
        headers: {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": apiKey,
            "Accept-Language": "zh-CN,zh;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        }
    };
    request(options, function(error, response, body){
        bodyObj = JSON.parse(body);
        callback(bodyObj);
    });
}

function getMatchDetailsByGameId(gameId, callback){
    var options = {
        url: 'https://na1.api.riotgames.com/lol/match/v3/matches/' + gameId,
        headers: {
            "Origin": "https://developer.riotgames.com",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Riot-Token": apiKey,
            "Accept-Language": "zh-CN,zh;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        }
    };
    request(options, function(error, response, body){
        bodyObj = JSON.parse(body);
        callback(bodyObj);
    });
}

function getBullupMatchDetailsBySummonerName(name,startTime,endTime,callback){
    /*
        {
            "matches" : [
                {
                    "name" : "Who is 55Kai",
                    "championId" : "1",
                    "championName" : "黑暗之女",
                    "gameMode" : "经典匹配",
                    "time" : "2017-05-09 15:34:03",
                    "kda" : "13/0/9",
                    "win" : true,
                    "paticipant" : [
                        {
                            "name" : "Who is 55Kai",
                            "lane" : "打野",
                            "kda" : "13/0/9",
                            "kdaScore" : "13.5",
                            "damage" : "20000",
                            "damageTaken": "15000",
                            "goldEarned" : "12000",
                            "items" : {
                                "item0" : 1,
                                "item1" : 1,
                                "item2" : 1,
                                "item3" : 1,
                                "item4" : 1,
                                "item5" : 1,
                                "item6" : 1
                            }
                        }
                        ...
                    ]

                }
                ...
            ]
        }
    */

}

//--------------------------------------data--------------------------------------------/

//--------------------------------------test--------------------------------------------/


// getSummonerByName("JMGuo", function(info){
//     console.log("JMGuo's info : " + JSON.stringify(info));
// });

// getChampionsStaticData(function(obj){
//     var count = 0;
//     for(var index in obj){
//         count++;
//         console.log("id:" + obj[index].id + " name:" + obj[index].name);
//     }
//     console.log(count);
// });

// getItemsStaticData(function(obj){
//     for(var index in obj){
//         console.log("id:" + obj[index].id + " name:" + obj[index].name);
//     }
// });

// getRecentMatchesListByAccountId(220718535, function(matches){
//     console.log(matches.matches[0].champion);
//     console.log(matches.matches[0].gameId);
// });

getMatchDetailsByGameId(2564449052, function(gameInfo){
    console.log(JSON.stringify(gameInfo));
});