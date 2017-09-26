var env = process.env.NODE_ENV || 'development'; //environment variables
console.log('env ***** ', env);


if(env === 'development' || env === 'test'){
    var config = require('./config.json');
    var envConfig = config[env]; //bracket notation = when u want to use a variable to grab a propert
    
    //console.log(Object.keys(envConfig));

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    })    
}

