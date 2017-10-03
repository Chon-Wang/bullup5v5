  
  $().ready(function () {
  $('#feedbackInput').on('click', function (e) {
		e.preventDefault();
        var $name = $('#last_named').val();
        var $email=$('#emails').val();
        var $textarea1=$('#textarea1').val();
        var $radioReason = $('input:radio:checked').val();
        var $account = userInfo.name;
        //alert($account);
        if(userInfo==null){
            alert("提示:","您没有登陆请登录");
        }else{
            socket.emit('feedbackMessage',{
                name:$name,
                email:$email,
                textarea1:$radioReason+',其他:'+$textarea1,
                UserId:userInfo.userId,
                account:$account
            });
        }
        $('#fankui').modal('close');
        // alert('反馈已提交，请耐心等待处理');
    });
  });