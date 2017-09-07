var cdr = require("child_process");
var robot = require("./robot");
var async = require("async")

var area = "china";
//var area = "america";

exports.findLOLPicture = function(templateName, callback){
    cdr.exec("PictureMatcher.exe [League of Legends] [./resources/" + area +"/" + templateName + "]", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        if (stderr){
            console.error(stderr);
            return;
        }
        var matchResult = JSON.parse(stdout.toString());
        callback(matchResult);
     });
}

exports.findPictureAndClick = function(windowName, templatePath, callback){
    cdr.exec("PictureMatcher.exe [" + windowName + "] [" + templatePath + "]", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        if (stderr){
            console.error(stderr);
            return;
        }
        var matchResult = JSON.parse(stdout.toString());
        robot.moveMouseToLocationAndDClick(matchResult.window_x + matchResult.template_x + 5, matchResult.window_y + matchResult.template_y + 5);
        callback(matchResult);
    });
}