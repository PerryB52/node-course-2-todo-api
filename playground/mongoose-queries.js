const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// //if id is invalid(ex: extra characters) the below methods will return an error - last one treats it
var id = '59b6edb7e6c942001bfa0c70';

if(!ObjectId.isValid(id)){
    console.log('id not valid');
}

//alternate mongoose query modes

//Todo.find
Todo.find({//if document is not found response = empty array
    _id: id //mongoose wil take the id variable and convert to object id
}).then((todos) => {
    console.log('Todos', todos);
});

//Todo.findOne - similar to find - retrieves 1 document at most
Todo.findOne({//if document is not found = response is null
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

//Todo.findById
Todo.findById(id).then((todo) => {//if document is not found = response is null
    if(!todo){
        return console.log('id not found');
    }
    console.log('Todo by ID', todo);
}).catch((e) => console.log(e)); 


var userId = '59b588ba06450db0369cf88a';

User.findById(userId).then((user) => {
    if(!user){
        return console.log('user not found');
    }

    console.log('User by ID', user);
}).catch((e) => console.log(e));