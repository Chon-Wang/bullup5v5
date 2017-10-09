var dbutil = require('./util/dbutil')

exports.autoUpdateRankList = function(time){
    //dbutil.updateRankList();
    setInterval(function(){
        console.log('update rank');
        dbutil.updateRankList();
    },time);
}