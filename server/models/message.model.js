var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({

    senderId   : { type: String,  required: true, unique: true  },
    recevierId : { type: String,  required: true, unique: false },
    date       : { type: Date,    required: true, unique: true  },
    message    : { type: String,  required: true, unique: false },
});



module.exports = mongoose.model('Message', MessageSchema);
