

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
        content: { type: String, required: true}
    },
)


const Chat = new Schema(
    {
        users: { type: [Schema.ObjectId], ref: 'user'},
        content: { type: [MessageSchema], ref:'message'}
    },
)


module.exports = mongoose.model('chat', Chat)
