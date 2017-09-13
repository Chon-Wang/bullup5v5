var dbutil = require('./util/dbutil')

exports.autoUpdateRankList = function(time){
    dbutil.updateRankList();
    // setInterval(function(){
    //     dbutil.updateRankList();
    // },time);
}