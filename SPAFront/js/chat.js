// $('#sub_btn').unbind();
// function replace_em(str){
	
// 		str = str.replace(/\</g,'&lt;');
	
// 		str = str.replace(/\>/g,'&gt;');
	
// 		str = str.replace(/\n/g,'<br/>');
	
// 		str = str.replace(/\[em_([0-9]*)\]/g,'<img src="media/arclist/$1.gif" border="0" />');
// 		console.log(str);
// 		return str;
// 	}
// $('.emotion').qqFace({

// 		id: 'facebox',

// 		assign: 'saytext',

// 		path: 'media/arclist/' //表情存放的路径

// 	});
// 	// $(".sub_btn").on("click",function () {

// 	// 	var str = $("#saytext").val();
		
// 	// 	$("#messages li").html();
// 	// });
// $('#sub_btn').on('click', function () {		
// 	console.log('进入聊天室123');
// 	if(userInfo == null){
// 		alert("请先登录");
// 		return ;
// 	}
// 	console.log('进入聊天室');
	
// 	// $('#saytext').text('')
// 	var $Msg = document.getElementById('saytext').value;
// 	var $chatName=userInfo.name; 
// 	//communicate with the server
// 	socket.emit('chatMsg', {	
// 		chatMsg:$Msg,
// 		chatName:$chatName
// 	});
// 	$("#messages li").html(replace_em($Msg));		
// 	$('#saytext').val('');
// });

$(document).ready(function () {
    function replace_em(str){
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="media/arclist/$1.gif" border="0" />');
        console.log(str);
        return str;
    }
    $('.emotion').qqFace({
        id: 'facebox',
        assign: 'saytext',
        path: 'media/arclist/' //表情存放的路径

    });

    $('#sub_btn').on('click', function () {		
        console.log('进入聊天室123');
        if(userInfo == null){
            bullup.alert("请先登录");
            return ;
        }
        console.log('进入聊天室');
        
        // $('#saytext').text('')
        var $Msg = document.getElementById('saytext').value;
        var $msg1 = replace_em($Msg);
        var $chatName=userInfo.name; 
        //communicate with the server
        socket.emit('chatMsg', {	
            chatMsg:$msg1,
            chatName:$chatName
        });
        // var lio = '<li class="friend-messages" style="width:88%;padding: 15px; margin: 5px 10px 0;  border-radius: 10px; font-size: 18px;;background: #009fab;color: #fff;float:left;"><img src="media/arclist/1.gif" border="0">'+replace_em(str)+'</li>';
        // $(replace_em($Msg)).append("#messages");		
        $('#saytext').val('');
    });
});