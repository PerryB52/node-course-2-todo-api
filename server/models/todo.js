var mongoose = require('mongoose');

//create model for everything you want to store
//arg1 name, arg2 the object model
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
});

module.exports = {Todo};