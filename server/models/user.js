var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

//override existing method
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
};

//adding instance methods = methods
UserSchema.methods.generateAuthToken = function () {//using old syntax so we can bind .this keyword
//arrow functions do not bind .this keyword
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    //push to user tokens array
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

//model method = statics
UserSchema.statics.findByToken = function (token) {
    var User = this; //entire model is binded with .this
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

//add user and pw validation method
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        //bcrypt only supports callbacks - we make our own promise
        return new Promise((resolve, reject) => {   
            //use bcrypt. compare to compare pw and user.pw
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

//middleware used to hash pw before storing in mongo
UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')){ //this method checks if a field has been modified
        //user.password
        //user.password = hash
        //next
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});



var User = mongoose.model('users', UserSchema);

module.exports = {User};