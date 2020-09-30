var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({

    userId   : { type: String,  required: true, unique: true  },
    name     : { type: String,  required: true, unique: false },
    userName : { type: String,  required: true, unique: true  },
    password : { type: String,  required: true, unique: false },
});


module.exports = mongoose.model('User', UserSchema);
