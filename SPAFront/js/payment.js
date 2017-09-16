var lolProcess = require('C:/Users/Public/Bullup/auto_program/lol_process.js');
var child_process = require("child_process");
var request = require("request");

$(document).ready(function(){
    $("#router_index").click(function(e){
        alert(1);
        var options = {
            url: 'http://localhost:3001',
        };
        request(options, function(error, response, body){
            var bodyStartIndex = body.indexOf("<body>");
            var bodyEndIndex = body.indexOf("</body>");
            var htmlStr = body.substr(0, bodyEndIndex);
            htmlStr = htmlStr.substr(bodyStartIndex + 6, htmlStr.length - 6);
            $('#payment').html(htmlStr);
        });
    })
});