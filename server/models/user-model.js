const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        user: { type: String, required: true },
        pass: { type: String, required: true },
        email: { type: String, required: true },
        first: { type: String, required: true },
        last: { type: String, required: true },
        watchlist: {type: [String], required: false}
    },
)

module.exports = mongoose.model('user', UserSchema)
