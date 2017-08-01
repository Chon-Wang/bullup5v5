var fs = require('fs');

var filePath = "";
var EOL =
  fileContents.indexOf('\r\n') >= 0 ? '\r\n' : '\n';

var text = fs.readFileSync(filePath, 'utf8');
    // 将文件按行拆成数组
    var textArray = text.split(EOL).forEach(function (line) {
    // ...
});