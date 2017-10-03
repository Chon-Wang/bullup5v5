if(bullup == null){
    var bullup = {};
}

bullup.alert = function(title, text) {
    $('#modalpopo .modal-content  h4').text(title)
    $('#modalpopo .ceneter_w').text(text)
    $('#modalpopo').modal('open'); 
}