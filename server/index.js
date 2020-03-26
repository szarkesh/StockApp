const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session');
const apiRoutes = require('./routes/api.js');
const accountRoutes = require('./routes/account.js')
const chatRoutes = require('./routes/chat.js')
const mongoose = require('mongoose')
var User = require('./models/user-model.js')

const app = express()
const apiPort = process.env.PORT || 3001

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stockapp', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection;


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60*60*24*1000 }}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://stockappexample.herokuapp.com',
  credentials: true
}));
app.use(bodyParser.json());
// app.use(
//   cookieSession({
//     name: 'local-session',
//     httpOnly: false,
//     keys: ['spooky'],
//     secure: false,
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   })
// )

app.use('/api',apiRoutes);
app.use('/user',accountRoutes);
app.use('/chat',chatRoutes);

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('current user is ' + req.session.user);
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
