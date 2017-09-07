var process = require("child_process");
var fs=require('fs');  

function readJsonStr(path, callback){
    fs.readFile(path, function(err,data){  
        if(err)  
            throw err;  
        var jsonObj=JSON.parse(data);  
        callback(JSON.stringify(jsonObj));
    });
}
 
process.execSync('BullupService gameMode');
readJsonStr('C:/Users/Public/Bullup/log.txt', function(jsonStr){
    console.log(jsonStr);
});