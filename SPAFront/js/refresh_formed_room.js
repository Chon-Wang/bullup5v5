$("#refresh_formed_battle_room").click(function(){
    socket.emit('refreshFormedBattleRoom');
});