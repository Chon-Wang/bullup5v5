var request = require('request');
var async = require('async');

var apiKey =  "RGAPI-92ab823d-d1f3-4d18-bcee-6602837899cf";

function getItemsStaticDataObj(callback){
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

function getChampionsStaticDataObj(callback){
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

function getSummonerDataObjByName(name, callback){
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

//--------------------------------------test--------------------------------------------/


// getSummonerDataObjByName("JMGuo", function(info){
//     console.log("JMGuo's info : " + JSON.stringify(info));
// });

// getChampionsStaticDataObj(function(obj){
//     for(var index in obj){
//         console.log("id:" + obj[index].id + " name:" + obj[index].name);
//     }
// });

// getItemsStaticDataObj(function(obj){
//     for(var index in obj){
//         console.log("id:" + obj[index].id + " name:" + obj[index].name);
//     }
// });