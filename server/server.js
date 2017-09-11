var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//configure body parser middleware
//with this in place you can send JSON to the express app and it will parse it
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        //sending an object that contains an array adds flexibility for later edits
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(3000, () => {
    console.log('started on port 3000')
});

module.exports = {app};