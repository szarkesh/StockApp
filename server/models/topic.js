

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

const Topic = new Schema(
    {
        name: { type: String}
    },
)

module.exports = mongoose.model('topic', Topic)
