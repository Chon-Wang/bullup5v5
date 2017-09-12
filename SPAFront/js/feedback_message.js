  
  $().ready(function () {
  $('#feedbackInput').on('click', function (e) {
		e.preventDefault();
        var $name = $('#last_named').val();
        var $email=$('#emails').val();
        var $textarea1=$('#textarea1').val();
        socket.emit('feedbackMessage',{
            name:$name,
            email:$email,
            textarea1:$textarea1
        });
    });
  });