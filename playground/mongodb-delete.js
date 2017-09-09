//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb') //pulls MongoClient property from require mongodb

//arg1 = connection string, arg2 = callback function error/db ojbect
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        //return prevents exec in case of err
        return console.log('Unable to connecto MongoDB server', err); 
    }

    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'eat luch'
    // }).then((result) => {
    //     console.log(result);
    // });

    //deleteOne - if multiple docs have the same criteria - it will delete thefirst one
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    // });

    //challenge
    db.collection('Users').deleteMany({
        name: 'Andrew'
    }).then((result) => {
        console.log(result);
    });

    // db.collection('Users').findOneAndDelete({
    //     age: 21
    // }).then((result) => {
    //     console.log(result);
    // });

    //db.close();
});