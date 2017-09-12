const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server'); //from root folder and back on directory = ./../
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectId(),
    text: 'First test todo'
},
{
    _id: new ObjectId(),
    text: 'second test todo'
}]

//this function will be run before every test case
//we are adding it becase we are assuming the db is empty
beforeEach((done) => {//remove all todos
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err){
                    return done(err); //return will stop function here
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    });

    it('should not create todo with invalid body data', (done) =>{
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done();
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });


    describe('GET /todos', () => {
        it('should get all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        });
    });

    describe('GET /todos:/id', () => {

        it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should return a 404 if todo not found', (done) => {
            //make sure you get a 404 back.
            request(app)
                .get(`/todos/${new ObjectId().toHexString}`)
                .expect(404)
                .end(done);
        });

        it('should return a 404 for non-object ids', (done) => {
            // /todos/123
            request(app)
                .get('/todos/123')
                .expect(404)
                .end(done);
        });
    });
});