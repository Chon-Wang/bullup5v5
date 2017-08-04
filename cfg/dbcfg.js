
exports.server = {
    host: '192.168.1.104',
    user: 'root',
    password: '123456',
    database: 'bullup'
};

exports.userTbl = {
    name: 'user',
    fields: {
        avatar: 'icon',
        email: 'email',
        id: 'user_id',
        tel: 'mobile_no',
        userName: 'nick_name',
        wealth: 'credit_worthines'
    }
};

exports.roleTbl = {
    name: 'role_info',
    fields: {
        id: 'role_id',
        userId: 'user_id',
        comprehensive: 'comprehensive',
        damageTaken: 'damage_taken',
        championKills: 'champion_kills',
        assists: 'assists',
        growth: 'growth',
        totalGames: 'total_games',
        kda: 'kda',
        averageGoldEarned: 'average_gold_earned',
        averageTurretsKilled: 'average_turrets_killed',
        averageLiving: 'average_living',
        averageDamageTaken: 'average_damage_taken'
    }
};

exports.friendTbl = {
    name: 'friend',
    fields: {
        userId: 'id',
        friendId: 'friend_id'
    }
};



