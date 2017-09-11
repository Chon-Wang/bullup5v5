$(document).ready(function(){
    $('#starter-fight-btn').on('click', function(){

    });

    $('#starter-match-btn').on('click', function(){
        
    });

    $('#starter-rank-btn').on('click', function(){
        alert("123");
        socket.emit('rankRequest');
    });

    $('#starter-chatroom-btn').on('click', function(){

    });
});