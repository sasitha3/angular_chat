var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = Schema({

    userId    : { type: String, required: true, unique: false },
    grade     : { 
                  name: {type: String, required: true, unique: false }, 
                  id:   {type: String, required: true, unique: false }
                },
    subject   : { 
                  name: {type: String, required: true, unique: false }, 
                  id:   {type: String, required: true, unique: false } 
                },
    amount    : { type: Number, required: true, unique: false },
    startTime : { type: String, required: true, unique: false },
    endTime   : { type: String, required: true, unique: false },
    date      : { type: Date,   required: true, unique: false },
    userName  : { type: String, required: true, unique: false },
    roomId    : { type: String, required: true, unique: true  },
    students  : [ String ]
});


module.exports = mongoose.model('Class', ClassSchema);
