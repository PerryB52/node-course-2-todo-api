const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

/* //initial hasshing
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});
*/

var hashedPassword = '$2a$10$wmHEoJ4cI/r2BT6Tj5IWEejmgDPHZ/xOXVAbW66WNTqKZD6u/lZqO';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

