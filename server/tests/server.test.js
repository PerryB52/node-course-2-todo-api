const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server'); //from root folder and back on directory = ./../
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



//this function will be run before every test case
//we are adding it becase we are assuming the db is empty
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(1);
                })
                .end(done);
        });
    });

    describe('GET /todos:/id', () => {

        it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should not return a todo created by another user', (done) => {
            request(app)
                .get(`/todos/${todos[1]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return a 404 if todo not found', (done) => {
            //make sure you get a 404 back.
            request(app)
                .get(`/todos/${new ObjectId().toHexString}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return a 404 for non-object ids', (done) => {
            // /todos/123
            request(app)
                .get('/todos/123')
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });


    describe('DELETE /todos/:id', () => {
        it('should remove a todo', (done) => {
            var hexId = todos[1]._id.toHexString();

            request(app)
                .delete(`/todos/${hexId}`)
                .set('x-auth', users[1].tokens[0].token)
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

        it('should not remove a todo owned by another user', (done) => {
            var hexId = todos[0]._id.toHexString();

            request(app)
                .delete(`/todos/${hexId}`)
                .set('x-auth', users[1].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if(err){
                        return done(err);
                    }

                    Todo.findById(hexId).then((todo) => {
                        expect(todo).toExist();
                        done();
                    }).catch((e) => done(e));
                });
        });
    

        it('should return 404 if todo not found', (done) => {
            //make sure you get a 404 back.
            request(app)
                .delete(`/todos/${new ObjectId().toHexString()}`)
                .set('x-auth', users[1].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 if object id is invalid', (done) => {
            // /todos/123
            request(app)
                .delete('/todos/123')
                .set('x-auth', users[1].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
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

        it('should not update another user`s todo', (done) => {
            //grab id of frist item
            var hexId = todos[0]._id.toHexString();
            var text = 'this should be the new text';

            request(app)
                .patch(`/todos/${hexId}`)
                .set('x-auth', users[1].tokens[0].token)
                .send({
                    completed: true,
                    text
                })
                .expect(404)
                .end(done);
        });

        it('should clear completedAt when todo is not completed', (done) => {
            var hexId = todos[1]._id.toHexString();
            var text = 'this should be the new text - second test';

            request(app)
                .patch(`/todos/${hexId}`)
                .set('x-auth', users[1].tokens[0].token)
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

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done)
        });

        it('should return a 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });

    describe('POST /users', () => {
        it('should create a user', (done) => {
            var email = 'example@example.com';
            var password = '123mnb!';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist(); //bracket notation due to -
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
                .end((err) => {
                    if(err) {
                        return done(err);
                    }

                    User.findOne({email}).then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should return validation errors if request is invalid', (done) => {
            var email = 'and';
            var password = '123';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('should not create user if email in use', (done) => {
            request(app)
                .post('/users')
                .send({
                    email: users[0].email,
                    password: 'Password123!'
                })
                .expect(400)
                .end(done);
        });
    });

    describe('POST /users/login', () => {
        it('should login user and return auth token', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                })
                .end((err, res) => {
                    if (err){
                        return done(err);
                    }

                    User.findById(users[1]._id).then((user) => {
                        expect(user.tokens[1]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should reject invalid login', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password + '1'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.headers['x-auth']).toNotExist();
                })
                .end((err, res) => {
                    if (err){
                        return done(err);
                    }

                    User.findById(users[1]._id).then((user) => {
                        expect(user.tokens.length).toBe(1);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });

    describe('DELETE /users/me/token', () => {
        it('should remove AUTH token on logout', (done) => {
            request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if(err){
                        return done(err)
                    }

                    User.findById(users[0]._id).then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
            });
        });
    });
});