if(bullup == null){
    var bullup = {};
}

bullup.alert = function(text, title = "提示") {
    $('#modalpopo .modal-content  h4').text(title);
    $('#modalpopo .ceneter_w').text(text);
    //$('#modalpopo').modal('open'); 
    $('#modalpopo').modal('open');
} 