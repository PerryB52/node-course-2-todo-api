//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb') //pulls MongoClient property from require mongodb

//arg1 = connection string, arg2 = callback function errro/db ojbect
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        //return prevents exec in case of err
        return console.log('Unable to connecto MongoDB server', err); 
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({ //arg1 - the object we want to insert
    //     text: 'Something to do',
    //     compelted: false
    // }, (err, result) => {//arg2 - the callback function with error and result
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Andrew',
    //     age: 25,
    //     location: 'Philadelphia'

    // }, (err, result) => {
    //     if(err){
    //         return console.log('unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));

    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    

    db.close();
});