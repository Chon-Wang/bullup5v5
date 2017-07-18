exports.hello = function() {
    console.log('hello');
}

exports.hello2 = function() {
    console.log('hello2');
    this.hello();
}

require('./test.js').hello2();