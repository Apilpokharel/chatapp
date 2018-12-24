'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const chatSchema = mongoose.Schema({

    chatname1: {type: String, trim: true},
    chatname2: {type: String, trim: true},
    info:[{
        sender: {type:mongoose.Schema.Types.ObjectId},
        receiver:{type:String},
        msg:[{
            value:{type:String, trim: true},
            filename:[String],
            notShowTo:[mongoose.Schema.Types.ObjectId]
        }],
        isRead:{type: Boolean, default: false},
    }]
    
});


module.exports = mongoose.model('chats', chatSchema);