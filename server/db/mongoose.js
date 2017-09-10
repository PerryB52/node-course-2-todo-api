var mongoose = require('mongoose');

//tell mongoose which promise library to use
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose}; //es6 syntax prop = variable name = 1 line

