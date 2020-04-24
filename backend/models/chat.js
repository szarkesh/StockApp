

const mongoose = require('mongoose')
//import {MessageSchema} from './message';
const Schema = mongoose.Schema
//const {UserSchema} from './user-model';

// const Chat = new Schema(
//     {
//         users: {type: [User], required:true},
//         messages: {type: [ Message ], required:true}
//     },
// )

const MessageSchema = new Schema(
    {
        sender: { type: String, required: true },
        content: { type: String, required: true},
        image: { type: String, required: false},
        time : { type : Date, default: Date.now }
    },
)


const Chat = new Schema(
    {
        users: { type: [Schema.ObjectId], ref: 'user'},
        content: { type: [MessageSchema], ref:'message'},
        typers: { type: [Schema.ObjectId], ref: 'user'}, // people who are currently typing
        seeners: { type: [String] },
        last_message: { type: MessageSchema }
    },
)


module.exports = mongoose.model('chat', Chat)
