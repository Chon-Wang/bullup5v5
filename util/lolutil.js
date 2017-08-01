var request = require('request');

var options = {
    url: 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/JMGuo?api_key=RGAPI-10684ecd-92b2-4dbf-b526-52b9826fde27',
    headers:{
        "Origin": "https://developer.riotgames.com",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Riot-Token": "RGAPI-10684ecd-92b2-4dbf-b526-52b9826fde27",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
    }
};

function callback(error, response, body) {
    //console.log(response); 
    console.log(body);

}

request(options, callback);