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

    $("#saytext").keypress(function(event){
        if(event.which == 13) { 
            $('#sub_btn').click();
            $('#saytext').val("");
        }
    });

    $('#sub_btn').on('click', function () {		
        if(userInfo == null){
            bullup.alert("请先登录");
            return ;
        }
        var $Msg = document.getElementById('saytext').value;
        if($Msg == ""){
            return;
        }
        var $msg1 = replace_em($Msg);
        var $chatName=userInfo.name; 
        socket.emit('chatMsg', {	
            chatMsg:$msg1,
            chatName:$chatName,
            userIconId:userInfo.avatarId
        });
        $('#saytext').val('');
    });
});