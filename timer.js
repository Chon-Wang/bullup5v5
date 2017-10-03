var dbutil = require('./util/dbutil')

exports.autoUpdateRankList = function(time){
    dbutil.updateRankList();
    // setInterval(function(){
    //     dbutil.updateRankList();
    // },time);
}

// exports.autoUpdatematchRankList = function(time){
//     dbutil.updatematchRankList();
//     // setInterval(function(){
//     //     dbutil.updateRankList();
//     // },time);
// }

exports.autoUpdateMatchState = function(time){
    dbutil.autoUpdateMatchState();
    // setInterval(function(){
    //     dbutil.updateRankList();
    // },time);
}


