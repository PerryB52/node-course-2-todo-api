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
    text: 'second test todo',
    completed: true,
    completedAt: 333
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


    describe('DELETE /todos/:id', () => {
        it('should remove a todo', (done) => {
            var hexId = todos[1]._id.toHexString();

            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexId);
                })
                .end((err, res) => {
                    if(err){
                        return done(err);
                    }

                    Todo.findById(hexId).then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should return 404 if todo not found', (done) => {
            //make sure you get a 404 back.
            request(app)
                .delete(`/todos/${new ObjectId().toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
            // /todos/123
            request(app)
                .delete('/todos/123')
                .expect(404)
                .end(done);
        });
    });

    describe('Testing PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
            //grab id of frist item
            var hexId = todos[0]._id.toHexString();
            var text = 'this should be the new text';

            request(app)
                .patch(`/todos/${hexId}`)
                .send({
                    completed: true,
                    text
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                })
                .end(done);
        });

        it('should clear completedAt when todo is not completed', (done) => {
            var hexId = todos[1]._id.toHexString();
            var text = 'this should be the new text - second test';

            request(app)
                .patch(`/todos/${hexId}`)
                .send({
                    completed: false,
                    text
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        });
    });
});