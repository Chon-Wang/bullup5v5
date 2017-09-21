$(document).ready(function(){
    $('#starter-fight-btn').on('click', function(){

    });

    $('#starter-match-btn').on('click', function(){
        
    });

    $('#starter-rank-btn').on('click', function(){
        // alert("123");
        // socket.emit('rankRequest');
    });

    $('#starter-chatroom-btn').on('click', function(){

    });
});

function addFireAnimation (id){
    var yzhou = document.getElementById(id);
    var img = yzhou.getElementsByTagName('img')[0];
    var chong = 0;
    var tm = null;
    tm = setInterval(function() {
        yzhou.scrollTop++;
        if (yzhou.scrollTop >= img.offsetHeight - yzhou.clientHeight) {
            yzhou.scrollTop = 0;
        }
    }, 20);
}

function autoplay() {
    clearTimeout(time);
    time = setTimeout(autoplay, 4500);
    //$('.carousel').carousel('next');
}


//给主页4个按钮增加火焰动效
addFireAnimation("starter_competition_div");
addFireAnimation("starter_battle_div");
addFireAnimation("starter_rank_div");
addFireAnimation("starter_chatroom_div");

//轮播栏动效
$('.carousel.carousel-slider').carousel({
    fullWidth: true
});
var time =null;
$(".carousel-slider").hover(function () {
    console.log(1);
    clearTimeout(time);
},function (){
    clearTimeout(time);
    time = setTimeout(autoplay, 2000);
});  
function autoplay() {
    clearTimeout(time);
    time = setTimeout(autoplay, 4500);
    $('.carousel').carousel('next');
    // try{
    //     $('.carousel').carousel('next');
    // }catch(err){

    // }
    
}

autoplay();
