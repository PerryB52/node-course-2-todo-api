const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server'); //from root folder and back on directory = ./../
const {Todo} = require('./../models/todo');

//this function will be run before every test case
//we are adding it becase we are assuming the db is empty
beforeEach((done) => {//remove all todos
    Todo.remove({}).then(() => done());
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

                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });

});