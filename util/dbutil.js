var mysql = require('mysql');
var dbCfg = require('./dbcfg.js');
var logger = require('../util/logutil.js');
var async = require('async');
var socketProxy = require('../proxy/socketproxy.js');

var connection = mysql.createConnection(dbCfg.server);

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Mysql connected as id ' + connection.threadId);
});

exports.findUserByAccount = function (account, callback) {
    connection.query('select * from `user_base` where user_account=?', [account], function (err, results) {
        if (err) throw err;
        callback(results[0]);
    });
}

exports.findUserById = function (userId, callback) {
    async.waterfall([
        function (callback) {
            connection.query('select * from `user_base` where user_id=?', [userId], function (err, results, fields) {
                if (err) throw err;
                callback(null, results[0]);
            });
        },
        function (userBaseInfo, callback) {
            connection.query('select icon_id from `bullup_profile` where user_id=?', [userId], function (err, results, fields) {
                if (err) throw err;
                userBaseInfo.icon_id = results[0].icon_id;
                callback(null, userBaseInfo);
            });
        }
    ], function (err, res) {
        callback(res);
    });
}

exports.addUser = function (userInfo, callback) {
    async.waterfall([
        function (callback) {
            connection.query('insert into `user_base` (user_account, user_password, user_nickname) values (?, ?, ?)', [userInfo.userAccount, userInfo.userPassword, userInfo.userNickname], function (err, rows) {
                if (err) {
                    connection.rollback();
                }
                if (rows.affectedRows > 0) {
                    callback(null, userInfo);
                }
            });
        },
        function (userInfo, callback) {
            connection.query('select user_id from `user_base` where user_account = ? and user_nickname = ?', [userInfo.userAccount, userInfo.userNickname], function (err, row) {
                if (err) console.log(err);
                userInfo.userId = row[0].user_id;
                callback(null, userInfo);
            });
        },
        function (userInfo, callback) {
            connection.query('insert into `user_info` (user_id, user_phone, user_mail) values (?, ?, ?)', [userInfo.userId, userInfo.userPhoneNumber, userInfo.userEmail], function (err, row) {
                if (err) console.log(err);
                callback(null, userInfo);
            });
        },
        function (userInfo, callback) {
            connection.query('insert into `bullup_profile` (user_id, icon_id) values (?, ?)', [userInfo.userId, 1], function (err, row) {
                callback(null, userInfo);
            });
        },
        function (userInfo, callback) {
            connection.query('insert into `bullup_wealth` (user_id, bullup_currency_type, bullup_currency_amount) values (?, ?, ?)', [userInfo.userId, 'score', '0'], function (err, row) {
                userInfo.wealth = 0;
                callback(null, userInfo);
            });
        },
        function (userInfo, callback) {
            connection.query("insert into bullup_strength values (?, 0, 0, 0, 0, 0, 0, 0, 0, 'unknown', 0, 0, 0, 0)", [userInfo.userId], function (err, res) {
                userInfo.strengthScore = 0;
                callback(null, userInfo);
            });
        },
        function (userInfo, callback) {
            connection.query("select count(user_id) from bullup_rank", [], function (err, res) {
                connection.query("insert into bullup_rank values (?, 0, ?, 0, ?, 0, ?, 1, ?)", [userInfo.userId, Number(res[0]['count(user_id)']) + 1, Number(res[0]['count(user_id)']) + 1, Number(res[0]['count(user_id)']) + 1, userInfo.userNickname], function (err, res) {
                    callback(null, userInfo);
                });
            });

        }
    ],
        function (err, result) {
            if (err) console.log(err);
            callback(result);
        });

}

exports.findUserIconById = function (userId, callback) {
    connection.query('select icon_id from `bullup_profile` where user_id=?', [userId], function (err, results, fields) {
        if (err) throw err;
        callback(results[0]);
    });

}

exports.findStrengthInfoByUserId = function (userId, callback) {
    connection.query('select * from bullup_strength where user_id=?', [userId], function (err, row) {
        if (err) throw err;
        callback(row[0]);
    });
}

exports.findUserWealthByUserId = function (userId, callback) {
    connection.query('select bullup_currency_amount from bullup_wealth where user_id = ? and bullup_currency_type = ?', [userId, 'score'], function (err, row) {
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
exports.findFriendListByUserId = function (userId, callback) {
    connection.query('select friend_user_id from bullup_friend where user_id=?', [userId], function (err, rows) {
        var friendList = {};
        async.eachSeries(rows, function (row, errCb) {
            exports.findUserById(row.friend_user_id, function (user) {

                // var online = require('../proxy/socketproxy').isUserOnline(user.user_id);
                // var status = null;

                // //获取用户状态
                // if (online) {
                //     status = socketProxy.mapUserIdToSocket(user.user_id).status;
                // }
                friendList[user.user_nickname] = {
                    name: user.user_nickname,
                    userId: user.user_id,
                    avatarId: user.icon_id,
                    online: "true",
                    status: "idle"
                };
                errCb();
            })
        }, function (err) {
            if (err) console.log(err);
            callback(friendList);
        });
    })
}

exports.findUserLOLAccountInfo = function (userId, callback) {
    connection.query('select lol_info_id from lol_bind  where user_id = ?', [userId], function (err, rows) {
        if (rows[0] != undefined) {
            var lolInfoId = rows[0].lol_info_id;
            connection.query('select * from lol_info where lol_info_id = ?', [lolInfoId], function (err, rows) {
                callback(rows[0]);
            });
        } else {
            var blankObj;
            callback(blankObj);
        }
    });
}

exports.getStrengthScoreRank = function (userId, callback) {
    async.waterfall([
        function (callback) {
            connection.query('select * from bullup_rank where user_id = ?', [userId], function (err, row) {
                if (err) {
                    throw err;
                }
                var data = {};
                data.userRankInfo = row[0];
                callback(null, data);
            });
        },
        function (data, callback) {
            connection.query('select user_id, user_nickname, bullup_strength_score, bullup_strength_rank, user_icon_id from bullup_rank order by bullup_strength_score desc limit 100', function (err, row) {
                if (err) {
                    throw err;
                }
                data.rankList = row;
                callback(null, data);
            });
        }
    ], function (err, res) {
        callback(res);
    });
}

exports.getWealthRank = function (userId, callback) {
    async.waterfall([
        function (callback) {
            connection.query('select * from bullup_rank where user_id = ?', [userId], function (err, row) {
                if (err) {
                    throw err;
                }
                var data = {};
                data.userRankInfo = row[0];
                callback(null, data);
            });
        },
        function (data, callback) {
            connection.query('select user_id, user_nickname, bullup_wealth_sum, bullup_wealth_rank, user_icon_id from bullup_rank order by bullup_wealth_sum desc limit 100', function (err, row) {
                if (err) {
                    throw err;
                }
                data.rankList = row;
                callback(null, data);
            });
        }
    ], function (err, res) {
        callback(res);
    });
}

exports.updateRankList = function () {
    async.waterfall([
        function (callback) {
            connection.query('select user_id,bullup_currency_amount from bullup_wealth order by bullup_currency_amount desc', function (err, row) {
                if (err) {
                    throw err;
                }
                callback(null, row);
            });
        },
        function (usersWealthInfo, callback) {
            var usersInfo = {};
            async.eachSeries(usersWealthInfo, function (wealthInfo, errCb) {
                connection.query('select user_nickname from user_base where user_id = ?', [wealthInfo.user_id], function (err, row) {
                    if (err) {
                        throw err;
                    }
                    (usersInfo[wealthInfo.user_id]) = {};
                    (usersInfo[wealthInfo.user_id]).user_id = wealthInfo.user_id;
                    (usersInfo[wealthInfo.user_id]).user_nickname = row[0].user_nickname;
                    (usersInfo[wealthInfo.user_id]).user_wealth = wealthInfo.bullup_currency_amount;
                    errCb();
                });
            }, function (errCb) {
                callback(null, usersInfo);
            });
        }, function (usersWealthInfo, callback) {
            var res = usersWealthInfo;
            async.eachSeries(usersWealthInfo, function (wealthInfo, errCb) {
                connection.query('select icon_id from bullup_profile where user_id = ?', [wealthInfo.user_id], function (err, row) {
                    if (err) {
                        throw err;
                    }
                    (res[wealthInfo.user_id]).icon_id = row[0].icon_id;
                    errCb();
                });
            }, function (errCb) {
                callback(null, res);
            });
        }
    ], function (err, wealthRankList) {
        if (err) console.log(err);
        var wealthArray = new Array();
        for (obj in wealthRankList) {
            wealthArray.push(wealthRankList[obj]);
        }
        wealthArray.sort(function (x, y) {
            return x.user_wealth < y.user_wealth ? 1 : -1;
        });
        for (var index = 0; index < wealthArray.length; index++) {
            var userRankInfo = wealthArray[index];
            connection.query('update bullup_rank set bullup_wealth_sum=?,bullup_wealth_rank=?,user_icon_id=?,user_nickname=? where user_id=?', [userRankInfo.user_wealth, index + 1, userRankInfo.icon_id, userRankInfo.user_nickname, userRankInfo.user_id], function (err, res) {
                if (err) {
                    throw err;
                }
            });
        }
    });
    async.waterfall([
        function (callback) {
            connection.query('select user_id,bullup_strength_score from bullup_strength order by bullup_strength_score desc', function (err, row) {
                if (err) {
                    throw err;
                }
                callback(null, row);
            });
        },
        function (usersStrengthInfo, callback) {
            var usersInfo = {};
            async.eachSeries(usersStrengthInfo, function (strengthInfo, errCb) {
                connection.query('select user_nickname from user_base where user_id = ?', [strengthInfo.user_id], function (err, row) {
                    if (err) {
                        throw err;
                    }
                    (usersInfo[strengthInfo.user_id]) = {};
                    (usersInfo[strengthInfo.user_id]).user_id = strengthInfo.user_id;
                    (usersInfo[strengthInfo.user_id]).user_nickname = row[0].user_nickname;
                    (usersInfo[strengthInfo.user_id]).user_strength = strengthInfo.bullup_strength_score;
                    errCb();
                });
            }, function (errCb) {
                callback(null, usersInfo);
            });
        }, function (usersStrengthInfo, callback) {
            var res = usersStrengthInfo;
            async.eachSeries(usersStrengthInfo, function (strengthInfo, errCb) {
                connection.query('select icon_id from bullup_profile where user_id = ?', [strengthInfo.user_id], function (err, row) {
                    if (err) {
                        throw err;
                    }
                    (res[strengthInfo.user_id]).icon_id = row[0].icon_id;
                    errCb();
                });
            }, function (errCb) {
                callback(null, res);
            });
        }
    ], function (err, strengthRankList) {
        if (err) console.log(err);
        var strengthArray = new Array();
        for (obj in strengthRankList) {
            strengthArray.push(strengthRankList[obj]);
        }
        strengthArray.sort(function (x, y) {
            return x.user_strength < y.user_strength ? 1 : -1;
        });
        for (var index = 0; index < strengthArray.length; index++) {
            var userRankInfo = strengthArray[index];
            connection.query('update bullup_rank set bullup_strength_score=?,bullup_strength_rank=?,user_icon_id=?,user_nickname=? where user_id=?', [userRankInfo.user_strength, index + 1, userRankInfo.icon_id, userRankInfo.user_nickname, userRankInfo.user_id], function (err, res) {
                if (err) {
                    throw err;
                }
            });
        }
    });
}

exports.validateBindInfo = function (userId, lolAccount, lolArea, callback) {
    async.waterfall([
        function (callback) {
            connection.query('select * from lol_info where user_lol_area = ? and user_lol_account = ?', [lolArea, lolAccount], function (err, res) {
                //首先判断该账号在该区是否可以绑定
                if (res[0] != undefined) {
                    var bindValidityResult = {};
                    bindValidityResult.value = 'false';
                    bindValidityResult.errorCode = 1;
                    callback('finished', bindValidityResult);
                } else {
                    var tempInfo = {};
                    tempInfo.userId = userId;
                    tempInfo.lolAccount = lolAccount;
                    tempInfo.lolArea = lolArea;
                    tempInfo.errorCode = 0;
                    tempInfo.value = 'true';
                    callback(null, tempInfo);
                }
            });
        },
        function (tempInfo, callback) {
            connection.query('select lol_info_id from lol_bind where user_id = ?', [tempInfo.userId], function (err, row) {
                if (err) {
                    throw err;
                }
                if (row[0] == undefined) {
                    //如果没有搜到，说明用户还没绑账号 可以绑定
                    var bindValidityResult = {};
                    bindValidityResult.value = 'true';
                    bindValidityResult.errorCode = 0;
                    callback('finished', bindValidityResult);
                } else {
                    var bindValidityResult = {};
                    bindValidityResult.value = 'false';
                    bindValidityResult.errorCode = 2;
                    callback('finished', bindValidityResult);

                    // //以下是同一斗牛电竞账号能绑定多个大区的LOL账号的扩展代码
                    // //如果用户已经绑定过账号了  则继续判断  该用户是否在该区绑定了账号
                    // tempInfo.lolInfoIds = row;
                    // callback(null, tempInfo);
                }
            });
        },
        function (tempInfo, callback) {
            var lolInfoIds = tempInfo.lolInfoIds;
            async.eachSeries(lolInfoIds, function (lolInfoId, errCb) {
                connection.query('select * from lol_info where lol_info_id = ?', [lolInfoId.lol_info_id], function (err, row) {
                    if (err) {
                        throw err;
                    }
                    if (tempInfo.lolArea == row[0].user_lol_area) {
                        //该区已绑定了其他账号
                        tempInfo.errorCode = 2;
                        tempInfo.value = 'false';
                    }
                    errCb();
                });
            }, function (errCb) {
                callback(null, tempInfo);
            });
        }
    ],
        function (err, result) {
            callback(result);
        });
}

exports.insertBindInfo = function (userId, lolAccount, lolNickname, lolArea, callback) {
    async.waterfall([
        function (callback) {
            var tempInfo = {};
            tempInfo.userId = userId;
            tempInfo.lolAccount = lolAccount;
            tempInfo.lolArea = lolArea;
            tempInfo.lolNickname = lolNickname;
            connection.query('insert into lol_info (user_lol_account, user_lol_nickname, user_lol_area) values (?, ?, ?)', [lolAccount, lolNickname, lolArea], function (err, row) {
                callback(null, tempInfo);
            });
        },
        function (tempInfo, callback) {
            connection.query('select lol_info_id from lol_info where user_lol_account = ? and user_lol_nickname = ? and user_lol_area = ?', [tempInfo.lolAccount, tempInfo.lolNickname, tempInfo.lolArea], function (err, row) {
                tempInfo.lolInfoId = row[0].lol_info_id;
                callback(null, tempInfo);
            });
        }
    ], function (err, result) {
        connection.query('insert into lol_bind (user_id, lol_info_id) values (?, ?)', [result.userId, result.lolInfoId], function (err, res) {
            var result = {};
            if (res.affectedRows > 0) {
                result.errorCode = 0;
            } else {
                result.errorCode = 1;
            }
            callback(result);
        });
    });
}

// exports.addStrengthInfo = function(bindInfo, callback){
//     connection.query("insert into bullup_strength values (?, 0, 0, 0, 0, 0, 0, 0, 0, 'unknown', 0, 0, 0, 0)", [bindInfo.userId], function(err, res){
//         callback(res);
//     });
// }

exports.updateStrengthInfo = function (bindInfo, callback) {
    //这里正常应该是通过获取绑定账号的数据来赋予初始战力  此处暂时默认初始战力为2000
    connection.query("update bullup_strength set bullup_strength_score = 2000 where user_id = ?", [bindInfo.userId], function (err, res) {
        callback(res);
    });
}

/**个人中心数据处理 */
exports.getPersonalCenterInfoByUserId = function (userId, callback) {
    console.log("id=" + userId);
    async.waterfall([
        function (callback) {
            //个人信息
            var userPersonalInfo = {};
            connection.query('select * from `user_base` where user_id=?', [userId], function (err, results, fields) {
                if (err) throw err;
                userPersonalInfo.userInfo = results;
                callback(null, userPersonalInfo);
            });
            //消费记录
        }, function (userPersonalInfo, callback) {
            connection.query('select * from bullup_payment_history where user_id=?', [userId], function (err, results, fields) {
                console.log("userId" + userPersonalInfo.userId);
                if (err) throw err;
                //payment_history.userId=results[0].user_id;
                userPersonalInfo.paymentHistory = results;
                console.log(JSON.stringify(userPersonalInfo.paymentHistory));
                callback(null, userPersonalInfo);
            });
            //个人能力数据
        }, function (userPersonalInfo, callback) {
            connection.query('select bullup_strength_wins,bullup_strength_k,bullup_strength_d,bullup_strength_a,bullup_strength_minion,bullup_strength_gold,bullup_strength_tower,bullup_strength_gold_perminiute,bullup_strength_damage,bullup_strength_damage_taken,bullup_strength_heal,bullup_strength_score from bullup_strength where user_id=?', [userId], function (err, results, fields) {
                if (err) throw err;
                userPersonalInfo.lolInfo_wins = results[0].bullup_strength_wins;
                userPersonalInfo.lolInfo_strength_k = results[0].bullup_strength_k;
                userPersonalInfo.lolInfo_strength_d = results[0].bullup_strength_d;
                userPersonalInfo.lolInfo_strength_a = results[0].bullup_strength_a;
                userPersonalInfo.lolInfo_strength_minion = results[0].bullup_strength_minion;
                userPersonalInfo.lolInfo_strength_gold = results[0].bullup_strength_gold;
                userPersonalInfo.lolInfo_strength_tower = results[0].bullup_strength_tower;
                userPersonalInfo.lolInfo_strength_damage = results[0].bullup_strength_damage;
                userPersonalInfo.lolInfo_strength_damage_taken = results[0].bullup_strength_damage_taken;
                userPersonalInfo.lolInfo_strength_score = results[0].bullup_strength_score;
                userPersonalInfo.lolInfo_strength_gold_perminiute = results[0].bullup_strength_gold_perminiute;
                userPersonalInfo.lolInfo_strength_heal = results[0].bullup_strength_heal;
                callback(null, userPersonalInfo);
            });
        }, function (userPersonalInfo, callback) {
            connection.query('select count(bullup_competition_id) as num ,bullup_competition_wins from bullup_competition_paticipant where user_id=?', [userId], function (err, results, fields) {
                if (err) throw err;
                userPersonalInfo.bullup_competitionResult = results[0].num;
                userPersonalInfo.bullup_competition_wins = results[0].bullup_competition_wins;
                userPersonalInfo.competition_wins = ((userPersonalInfo.bullup_competition_wins) / (userPersonalInfo.bullup_competitionResult)) + '%';
                callback(null, userPersonalInfo);
            });
        }, function (userPersonalInfo, callback) {
            //var lolInfoId={};
            connection.query('select lol_info_id from lol_bind where user_id=?', [userId], function (err, results, fields) {
                if (err) throw err;
                console.log('id:' + userId);
                userPersonalInfo.Id = results[0].lol_info_id;
                console.log('pid' + userPersonalInfo.Id);
                callback(null, userPersonalInfo);
            });
        }, function (userPersonalInfo, callback) {
            // var lolInfo={};
            connection.query('select * from lol_info where lol_info_id=?',[userPersonalInfo.Id],function(err, results, fields){
                if(err) throw err;
                userPersonalInfo.info=results;
               console.log(JSON.stringify("lolInfo:"+userPersonalInfo));
               callback(null,userPersonalInfo); 
            });
        // },function(userPersonalInfo,callback){
        //     //个人战斗力排行
        //     connection.query('select bullup_strength_score from bullup_strength where user_id=?',[userId],function(err,results,fields){
        //         if(err) throw err;
        //         let temp = results[0].bullup_strength_score;
        //         //console.log(temp);
        //         connection.query('select count(*) as strengthRank from bullup_strength where bullup_strength_score>=?',[userId],function(err,results2,fields){
        //             userPersonalInfo.strengthRank=results2;
        //             console.log(JSON.stringify("strengthRank:"+userPersonalInfo.strengthRank));
        //             callback(null,userPersonalInfo);
        //         });
        //     });
         },function(userPersonalInfo,callback){
             connection.query('select bullup_currency_amount from bullup_wealth where user_id=?',[userId],function(err,results,fields){
            if(err) throw err;
                 userPersonalInfo.wealth=results[0].bullup_currency_amount;
                 callback(null,userPersonalInfo);
            });
        // },function(userPersonalInfo,callback){
        //      //个人财富排行
        //      connection.query('select bullup_currency_amount from bullup_wealth where user_id=?',[userId],function(err,results,fields){
        //          if(err) throw err;
        //          let temp2 = results[0].bullup_currency_amount;
        //          console.log(temp2);
        //          connection.query('select count(*) as wealthRank from bullup_wealth where bullup_currency_amount>=?',[temp2],function(err,results2,fields){
        //              if(err) throw err;
        //              userPersonalInfo.wealthRank=results2;
        //              console.log(JSON.stringify("wealthRank:"+userPersonalInfo.wealthRank));
        //              callback(null,userPersonalInfo);
        //          });
        //      });
         },function(userPersonalInfo,callback){
             connection.query('select bullup_strength_rank,bullup_wealth_rank,user_icon_id from bullup_rank',[userId],function(err,results,fields){
                if (err) throw err;
                userPersonalInfo.strengthRank=results[0].bullup_strength_rank;
                userPersonalInfo.wealthRank=results[0].bullup_wealth_rank;
                callback(null,userPersonalInfo);
             });
         },function(userPersonalInfo,callback){
             connection.query('select icon_id from bullup_profile  where user_id=?',[userId],function(err,results,fields){
                if (err) throw err;
                userPersonalInfo.icon_id=results[0].icon_id;
                callback(null,userPersonalInfo);
             });
         }
    ],function(err,res){
        callback(res);
        console.log(res);
    });
}


exports.insertFeedback = function (UserId, textarea1, name, email, callback) {
    // console.log(userId);
    async.waterfall([
        function (callback) {
            connection.query('insert into bullup_feedback (user_id,user_feedback_content,user_feedback_name,user_feedback_email) values (?,?,?,?)', [UserId, textarea1, name, email], function (err, results, fields) {
                var feedbackMessage = {};
                //feedbackMessage.user_id=userId;
                feedbackMessage.textarea1 = textarea1;
                feedbackMessage.name = name;
                feedbackMessage.email = email;
                if (err) {
                    connection.rollback();
                } else {
                    callback(null, feedbackMessage);
                }
            });
        }
    ], function (err, res) {
        callback(res)
    });
}

/**
 * 收集银行信息
 * @param getBankInfo 收集信息
 */
exports.insertBankInfo = function (bankInfo, callback) {
    var month = bankInfo.exptremonth + 1;
    connection.query('insert into bullup_bankcard_info(user_id,bullup_bank_cardnumber,Bullup_bank_cvc,Bullup_bank_expiremonth,Bullup_bank_expireyear,Bullup_bank_country,Bullup_bank_firstname,Bullup_bank_lastname,Bullup_bank_areacode,Bullup_bank_phone,Bullup_bank_money,Bullup_bank_email,Bullup_bank_companyname,Bullup_bank_streetaddress,Bullup_bank_apt_suite_bldg,Bullup_bank_zipcode) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',

        [bankInfo.userId, bankInfo.cardnumber, bankInfo.cvc, month, bankInfo.exptreyear, bankInfo.country, bankInfo.firstname, bankInfo.lastname, bankInfo.areacode, bankInfo.phone, bankInfo.money, bankInfo.email, bankInfo.companyname, bankInfo.streetaddress, bankInfo.apt_suite_bldg, bankInfo.zipcode], function (err, results) {
            if (err) throw err;
            callback(results);
        });
}
/**
 * 收集创建赛事信息
 * @param getmatchInfo 收集信息
 */
exports.insertMatchInfo = function (matchInfo, callback) {
    var status = 0;
    connection.query('insert into bullup_competition(user_id,bullup_competition_name,bullup_competition_status,bullup_competition_fee,bullup_competition_rule,bullup_competition_comment,bullup_competition_sign_start,bullup_competition_sign_end,bullup_competition_start,bullup_competition_end,bullup_competition_max_paticipant,bullup_competition_lowest_score,bullup_competition_highest_score,bullup_competition_date,bullup_competition_createname) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [matchInfo.userId, matchInfo.name, status, matchInfo.fee, matchInfo.rule, matchInfo.comment, matchInfo.sign_start_date, matchInfo.sign_end_date, matchInfo.start_date, matchInfo.end_date, matchInfo.max_paticipant, matchInfo.lowest_score, matchInfo.highest_score, matchInfo.date, matchInfo.createname], function (err, results) {
            if (err) throw err;
            callback(results);
        });

}

/**
 * 查看所有赛事
 */
exports.getMatchInfo = function (matchInfo, callback) {
    var query = {};
    async.waterfall([
        function (callback) {
            connection.query(' select * from bullup_competition', function (err, results) {
                query.results = results
                callback(null, query)
            });
        },
        function (query, callback) {
            connection.query('select * from bullup_competition_sign_up', function (err, res) {

                callback(null, query)
            });
        }
    ], function (err, data) {
        // console.log (query.results)
        callback(data);
    });
}
/**
 * 查看我所发起的赛事
 */
exports.getInitiateCompetition = function (matchInfo, callback) {
    connection.query('select * from `bullup_competition` where user_id=?', [matchInfo.userId], function (err, results) {
        if (err) throw err;

        callback(results);
    });
}
/**
 * 收集我参与的赛事信息
 */
exports.insertJoinCompetition = function (matchInfo, callback) {
    var status = 0;
    connection.query('insert into bullup_competition_sign_up(user_id,bullup_competition_id,bullup_sign_status) values (?,?,?)',
        [matchInfo.userId, matchInfo.matchId, status], function (err, results) {
            if (err) throw err;
            callback(results);
        });
}
/**
 * 查看我所参与的赛事
 */
exports.getJoinCompetition = function (matchInfo, callback) {
    connection.query('select s.bullup_competition_id,s.user_id,c.* from bullup_competition_sign_up s,bullup_competition c  where s.user_id=? and s.bullup_competition_id=c.bullup_competition_id', [matchInfo.userId], function (err, results) {
        if (err) throw err;
        callback(results);
    });
}
/**
 * 查看我参与赛事（比赛结束报名）
 */
exports.getCompetitionOver = function (matchInfo, callback) {
    var MatchInfo = {};
    connection.query('select bullup_competition_wins,bullup_competition_bonus from `bullup_competition_paticipant` order by user_id=? desc ', [userId, matchInfo.wins, matchInfo.bonus], function (err, results, fields) {
        if (err) throw err;
        MatchInfo = results;
        callback(null, MatchInfo);
    });
}
/**
 * 更新全部赛事状态
 */
exports.updateCompetition = function (matchInfo, callback) {
    var MatchInfo = {};
    connection.query('update bullup_competition  set bullup_competition_status=? where userid=?', [userId, matchInfo.status], function (err, result, fields) {
        if (err) throw err;
        MatchInfo = results;
        callback(null, MatchInfo);

    })
}
/**
 * 报名详情
 */
exports.getApplyInfo = function (matchInfo, callback) {
    // async.waterfall([
    //     function (callback) {
    //         connection.query('select * from `bullup_competition` where bullup_competition_id=?', [matchInfo.competitionid], function (err, results) {
    //             callback(res)
    //         });

    //     },
    //     function (query, callback) {
    //         connection.query('select * from bullup_competition where bullup_competition_id=?and user_id=?', [matchInfo.competitionid, matchInfo.userId], function (err, res) {
    //             if (err) throw errr;
    //             var temp = res;
    //             var temp2 = results;
    //             for (var i = 0; i < temp.length; i++) {
    //                 for (var j = 0; j < temp2.length; j++) {
    //                     if (temp2[j].user_id == matchInfo.userId && temp2[j].bullup_competition_id == temp2[i].bullup_competition_id) {
    //                         temp[j].flag = 1;
    //                     } else {
    //                         temp[j].flag = 0;
    //                     }
    //                 }
    //             }
    //             console.log(temp2);
    //             callback(results);
    //         });
    //     }
    // ], function (err, data) {
    //     // console.log (query.results)
    //     callback(data);
    // });
    var query = {};
    async.waterfall([
        function (callback) {
            connection.query('select * from bullup_competition where bullup_competition_id=?', [matchInfo.competitionid], function (err, results) {
                query.results = results
                callback(null, query)
            });
        },
        function (query, callback) {
            connection.query('select * from `bullup_competition_sign_up` where bullup_competition_id=? and user_id=?', [matchInfo.competitionid, matchInfo.userId], function (err, res) {
                //query.res=res;
                if (err) throw errr;
                var temp = query.results;
                var temp2 = res;
                for (var i = 0; i < temp.length; i++) {
                    for (var j = 0; j < temp2.length; j++) {
                       if (temp2[j].user_id == matchInfo.userId && temp2[j].bullup_competition_id == temp2[i].bullup_competition_id) {
                            temp[i].flag = 1;
                        } 
                    }
                }
                // console.log(temp);
                callback(null, query)
            });
        }
    ], function (err, data) {
        // console.log (query.results)
        callback(data);
    });

}


/**
 * 审核信息查询
 */
exports.getauditApplyInfo = function (matchInfo, callback) {
    var query = {};
    async.waterfall([
        function (callback) {
            connection.query('select * from user_base , bullup_strength where user_base.user_id =bullup_strength.user_id and user_base.user_id in (select user_id from  bullup_competition_sign_up  where  bullup_competition_id=?)', [matchInfo.competitionid], function (err, results) {
                query.results = results
                callback(null, query)
            });
        },
        function (query, callback) {
            connection.query('select * from bullup_competition_sign_up', function (err, res) {
                //query.res=res;
                if (err) throw errr;
                var temp = query.results;
                var temp2 = res;
                for (var i = 0; i < temp.length; i++) {
                    for (var j = 0; j < temp2.length; j++) {
                        if (temp[i].user_id == temp2[j].user_id) {
                            temp[i].bullup_sign_status = temp2[j].bullup_sign_status;
                            temp[i].bullup_competition_id = temp2[j].bullup_competition_id;
                        }
                    }
                }
                // console.log(temp);
                callback(null, query)
            });
        }
    ], function (err, data) {
        // console.log (query.results)
        callback(data);
    });
}

/**
 * 报名通过
 * 0为审核中
 * 1为审核通过
 * 2为审核未通过
 */
exports.updateagreeCompetition = function (matchInfo, callback) {
    connection.query('update bullup_competition_sign_up  set bullup_sign_status=1 where user_id=? and bullup_competition_id =? ', [matchInfo.signId, matchInfo.matchid], function (err, result) {
        if (err) throw err;

        callback(result);

    })
}
/**
 * 报名拒绝
 * 2为审核没通过
 */
exports.updaterejectCompetition = function (matchInfo, callback) {
    connection.query('update bullup_competition_sign_up  set bullup_sign_status=2 where user_id=? and bullup_competition_id =? ', [matchInfo.signId, matchInfo.matchid], function (err, result) {
        if (err) throw err;

        callback(result);

    })
}
/**
 * 自动更新赛事状态
 */
exports.autoUpdateMatchState = function (matchInfo, callback) {
    var date = new Date();
    connection.query('select * from bullup_competition', function (err, res) {
        if (res.bullup_competition_status == 0 && res.bullup_competition_sign_start <= date) {
            connection.query('update bullup_competition set bullup_competition_status=2', function (err, res) {
                callback(res);
            });
        } else if (res.bullup_competition_status == 3 && res.bullup_competition_start <= date) {
            connection.query('update bullup_competition set bullup_competition_status=1', function (err, res) {
                callback(res);
            });
        } else if (res.bullup_competition_status == 2 && res.bullup_competition_sign_end <= date) {
            connection.query('update bullup_competition set bullup_competition_status=3', function (err, res) {
                callback(res);
            });
        } else if (res.bullup_competition_status == 1 && res.bullup_competition_end <= date) {
            connection.query('update bullup_competition set bullup_competition_status=4', function (err, res) {
                callback(res);
            });
        }

    });
}
/**
 * 手动更新赛事状态
 */

// exports.ManualUpdateMatchState = function (matchInfo,callback){

// }
/**
 *   ┏┓　　　┏┓
 * ┏┛┻━━━┛┻┓
 * ┃　　　　　　　┃
 * ┃　　　━　　　┃
 * ┃　＞　　　＜　┃
 * ┃　　　　　　　┃
 * ┃...　⌒　...　┃
 * ┃　　　　　　　┃
 * ┗━┓　　　┏━┛
 *     ┃　　　┃　
 *     ┃　　　┃
 *     ┃　　　┃
 *     ┃　　　┃  神兽保佑
 *     ┃　　　┃  代码无bug　　
 *     ┃　　　┃
 *     ┃　　　┗━━━┓
 *     ┃　　　　　　　┣┓
 *     ┃　　　　　　　┏┛
 *     ┗┓┓┏━┳┓┏┛
 *       ┃┫┫　┃┫┫
 *       ┗┻┛　┗┻┛
 */

//exports.getPersonalCenterInfoByUserId(29, function(res){
 //   console.log(res);
//});

