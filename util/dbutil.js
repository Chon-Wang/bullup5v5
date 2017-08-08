var mysql = require('mysql');
var dbCfg = require('./dbcfg.js');
var logger = require('../util/logutil.js');
var async = require('async');
var socketProxy = require('../proxy/socketproxy.js');

var connection = mysql.createConnection(dbCfg.server);

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Mysql connected as id ' + connection.threadId);
});

/**
 * 通过用户名获取用户
 * @param nickname 用户名
 */
exports.findUserByAccount = function(account, callback) {
    connection.query('select * from `user_base` where user_account=?', [account], function (err, results){
        if (err) throw err;
        callback(results[0]);
    });
}

/**
 * 通过id获取用户
 * @param userId
 */
exports.findUserById = function(userId, callback) {
    connection.query('select * from `user_base` where user_id=?', [userId], function (err, results, fields) {
        if (err) throw err;
        callback(results[0]);
    });
}

/**
 * 插入用户信息
 * @param userInfo 用户信息，格式：{userName: 'cy', password: '123', tel: '123', email: '123@qq.com'}
 */
exports.addUser = function(userInfo, callback) {
    connection.query('insert into `user` (nick_name, password, mobile_no, email, icon) values (?, ?, ?, ?, ?)', 
        [userInfo.userName, userInfo.password, userInfo.tel, userInfo.email, 1], function (err, rows) {
            if (err) {
                connection.rollback();
            }
            callback(rows.insertId);
    });
}

exports.findUserIconById = function(userId, callback){
    connection.query('select icon_id from `bullup_profile` where user_id=?', [userId], function (err, results, fields) {
        if (err) throw err;
        callback(results[0]);
    });

}

/**
 * 通过用户信息查找角色信息
 * @param userId 用户的id5
 */
exports.findStrengthInfoByUserId = function(userId, callback) {
    connection.query('select * from bullup_strength where user_id=?',  [userId], function(err, row) {
        if (err) throw err;
        callback(row[0]);
    });
}

exports.findUserWealthByUserId = function(userId, callback) {
    connection.query('select bullup_currency_amount from bullup_wealth where user_id=?',  [userId], function(err, row) {
        if (err) throw err;
        callback(row[0]);
    });
}

exports.hello = function () {
    console.log('hello');
}
/**
 * 通过用户id获取用户的朋友列表
 */
exports.findFriendListByUserId = function(userId, callback) {
    connection.query('select friend_id from friend where id=?', [userId], function(err, rows) {
        var friendList = {};
        async.eachSeries(rows, function(row, errCb){
            exports.findUserById(row.friend_id, function(user) {
                
                var online = require('../proxy/socketproxy').isUserOnline(user.user_id);
                var status = null;
                
                //获取用户状态
                if (online) {
                    status = socketProxy.mapUserIdToSocket(user.user_id).status;
                }

                friendList[user.nick_name] = {
                    name: user.nick_name,
                    userId: user.user_id,
                    avatarId: user.icon,
                    online: online,
                    status: status
                };
                errCb();
            })
        }, function(err) {
            if (err) console.log(err);
            callback(friendList);
        });
    })
}


exports.getStrengthScoreRank = function(userId, callback) {
    async.waterfall([
        function(callback){
            connection.query('select user_id,bullup_strength_score from bullup_strength order by bullup_strength_score desc limit 100', function(err, row) {
                if (err){ 
                    throw err;
                }
                callback(null, row);
            });
        },
        function(usersStrengthInfo, callback){
            var usersInfo = {};
            async.eachSeries(usersStrengthInfo, function(strengthInfo, errCb){
                connection.query('select user_nickname from user_base where user_id = ?', [strengthInfo.user_id], function(err, row) {
                    if (err){ 
                        throw err;
                    }
                    (usersInfo[strengthInfo.user_id]) = {};
                    (usersInfo[strengthInfo.user_id]).user_id = strengthInfo.user_id;
                    (usersInfo[strengthInfo.user_id]).user_nickname = row[0].user_nickname;
                    (usersInfo[strengthInfo.user_id]).user_strength = strengthInfo.bullup_strength_score;
                    errCb();
                });
            },function(errCb){
                callback(null, usersInfo);
            });
        }, function(usersStrengthInfo, callback){
            var res = usersStrengthInfo;
            async.eachSeries(usersStrengthInfo, function(strengthInfo, errCb){
                connection.query('select icon_id from bullup_profile where user_id = ?', [strengthInfo.user_id], function(err, row) {
                    if (err){ 
                        throw err;
                    }
                    (res[strengthInfo.user_id]).icon_id = row[0].icon_id;
                    errCb();
                });
            },function(errCb){
                callback(null, res);
            });
        }
    ], function(err,result){
        if (err) console.log(err);
        callback(result)
    });
}



exports.getWealthRank = function(userId, callback) {
    async.waterfall([
        function(callback){
            connection.query('select user_id,bullup_currency_amount from bullup_wealth order by bullup_currency_amount desc limit 100', function(err, row) {
                if (err){ 
                    throw err;
                }
                callback(null, row);
            });
        },
        function(usersWealthInfo, callback){
            var usersInfo = {};
            async.eachSeries(usersWealthInfo, function(wealthInfo, errCb){
                connection.query('select user_nickname from user_base where user_id = ?', [wealthInfo.user_id], function(err, row) {
                    if (err){ 
                        throw err;
                    }
                    (usersInfo[wealthInfo.user_id]) = {};
                    (usersInfo[wealthInfo.user_id]).user_id = wealthInfo.user_id;
                    (usersInfo[wealthInfo.user_id]).user_nickname = row[0].user_nickname;
                    (usersInfo[wealthInfo.user_id]).user_wealth = wealthInfo.bullup_currency_amount;
                    errCb();
                });
            },function(errCb){
                callback(null, usersInfo);
            });
        }, function(usersWealthInfo, callback){
            var res = usersWealthInfo;
            async.eachSeries(usersWealthInfo, function(wealthInfo, errCb){
                connection.query('select icon_id from bullup_profile where user_id = ?', [wealthInfo.user_id], function(err, row) {
                    if (err){ 
                        throw err;
                    }
                    (res[wealthInfo.user_id]).icon_id = row[0].icon_id;
                    errCb();
                });
            },function(errCb){
                callback(null, res);
            });
        }
    ], function(err,result){
        if (err) console.log(err);
        callback(result)
    });
}

// exports.findFriendListByUserId(1, function (data) {
//     logger.jsonLog(data);
// });