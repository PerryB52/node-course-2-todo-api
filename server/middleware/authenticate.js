var {User} = require('./../models/user');

//creating our auth private middleware
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
        //custom model method
        User.findByToken(token).then((user) => {
            if(!user){
                return Promise.reject(); //sends you directly into .catch((e))
            }
            req.user = user;
            req.token = token;
            next();
            
        }).catch((e) => {
            res.status(401).send();
        });
}

module.exports = {authenticate};