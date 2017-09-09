var dbutil = require('./util/dbutil')

exports.autoUpdateRankList = function(time){
    setInterval(function(){
        dbutil.updateRankList();
    },time);
}