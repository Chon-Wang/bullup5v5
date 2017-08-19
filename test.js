var moment = require('moment');

var s1 = moment().format("YYYYMMDDHHmmss");
var s2 = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var s3 = moment("2016/04/01", "YYYY/MM/DD").format("YYYY-MM-DD");
var test = null;
console.log("s1=" + s1);
console.log("s2=" + s2);
console.log("s3=" + s3);
