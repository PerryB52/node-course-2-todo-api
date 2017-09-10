//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb') //pulls MongoClient property from require mongodb

//arg1 = connection string, arg2 = callback function error/db ojbect
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        //return prevents exec in case of err
        return console.log('Unable to connecto MongoDB server', err); 
    }

    // console.log('Connected to MongoDB server');
    // //arg1 filter, arg2 update(google mongo update operators),
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59b3dc3d4e33750561003d36')
    // }, {
    //     $set:{//google mongodb update operators (ex: set)
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false //in order to get back updated document
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('59b3df184e33750561003eea')
    }, {
        $set:{name: "Alxandru"},
        $inc:{age: 1}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

   
    //db.close();
});