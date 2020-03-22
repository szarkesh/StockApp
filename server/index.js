const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const apiRoutes = require('./routes/api.js')
const mongoose = require('mongoose')
var User = require('./models/user-model.js')

const app = express()
const apiPort = 8000

mongoose
    .connect('mongodb://127.0.0.1:27017/stockapp', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use('/api',apiRoutes);

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    var u = new User({name:"shaya", pass:"password"});
    u.save(function(err) {
       if (err) throw err;
       res.end('Author successfully saved.');
   });
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
