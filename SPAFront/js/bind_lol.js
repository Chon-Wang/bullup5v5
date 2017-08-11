$().ready(function () {
    $('#bind_lol_btn').on('click', function(e){
        e.preventDefault();
        socket.emit('lolBindRequest', {
            userId: 5,
            lolAccount: 'zhuangyuanzhi',
            lolArea: 'NU',
            lolNickname: 'Who is 55Kai'
        });
    });
});