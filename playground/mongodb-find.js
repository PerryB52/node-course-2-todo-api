//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb') //pulls MongoClient property from require mongodb

//arg1 = connection string, arg2 = callback function error/db ojbect
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        //return prevents exec in case of err
        return console.log('Unable to connecto MongoDB server', err); 
    }

    console.log('Connected to MongoDB server');

    //find() = returns a mongo db cursor- which has a lot of methods
    //find cursor toArray() method = returns a promise 
    db.collection('Todos').find({
        _id: new ObjectID('59b1a9d2298a1e2530fc5f60')    
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch todos', err);
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);

    }, (err) => {
        console.log('unable to fetch todos', err);
    });

    db.collection('Users').find({
        name: 'Andrew'
    }).toArray().then((docs) => {
        console.log('Users fetched: ');
        console.log(JSON.stringify(docs, undefined, 1));
    }, (err) => {
        console.log('unable to fetch todos');
    })

    //db.close();
});