const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    
    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(400).send();
        } else {
            return res.send({todo});
        }
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        } 
            
        return res.send({todo});
        
    }).then((e) => {
        res.status(400).send();
    });
     
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    //using lodash pick to filter out only the fields we want to update and prevent errors
    var body = _.pick(req.body, ['text','completed']);

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    //check completed propery and update completedAt by adding a timestamp if it is done
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {;
        body.completed = false;
        body.completedAt = null;
    }

    //similar to the mongo native update arguments but done in mongoose
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`started on port ${port}`)
});

module.exports = {app};