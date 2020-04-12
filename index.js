const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session');
const apiRoutes = require('./server/routes/api.js');
const accountRoutes = require('./server/routes/account.js')
const chatRoutes = require('./server/routes/chat.js')
const mongoose = require('mongoose')
const path = require('path')
var os = require('os');
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
var User = require('./server/models/user-model.js')
const MongoStore = require('connect-mongo')(session);

const app = express()

app.use(redirectToHTTPS([/localhost:(\d{4})/]));

const apiPort = process.env.PORT || 3001

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stockapp', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })


mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const db = mongoose.connection;

const isLocal = os.hostname().indexOf('local') > -1;

if (!isLocal) {
  app.set('trust proxy', 1);
}


app.use(session({ secret: 'keyboard cat',
                cookie:
                        {sameSite: isLocal ? 'Strict' : 'None',
                        secure:!isLocal,
                        maxAge: 60*60*24*1000,
                        },
                store: new MongoStore({mongooseConnection: mongoose.connection})}))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header('X-Forwarded-Proto', 'https');
    next();
});

app.use(express.static(path.join(__dirname, 'client/build')))

// app.use(cors({
//   origin: isLocal ? 'http://localhost:3000':'https://www.avana.io',
//   credentials: true
// }));
app.use(bodyParser.json());

app.use('/api',apiRoutes);
app.use('/user',accountRoutes);
app.use('/chat',chatRoutes);

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
