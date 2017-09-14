const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove (delete multiple records - using a query )
//result object displays how many records where removed
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

//find one and rmeove
//result contains exact object that got removed - similar to findOne
Todo.findOneAndRemove({_id:'59ba9aaba5150eafdcc8a236'}).then((todo) => {
    console.log(todo);
});


//find by id and remove
//result contains exact object that got removed
Todo.findByIdAndRemove('59ba9aaba5150eafdcc8a236').then((todo) => {
    console.log(todo);
});

