var express = require('express')
var router = express.Router()

var bcrypt = require('bcrypt');
const saltRounds = 10;

var User = require('../models/user-model.js')
var Chat = require('../models/chat.js')


router.post("/create", function(req, res, next){
  console.log('user is' + req.session.user);
  User.findOne({user: req.session.user}, function(err, user){
    let arr = [...req.body.ids, user._id];
    console.log('chat to be added includes' + arr);
    var newChat = Chat({users: arr, messages:[]});
    console.log(user);
    newChat.save(function(err, result){
      if(err){
        res.send(JSON.stringify(err))
      }
      else{
        res.send(JSON.stringify(result._id));
      }
    })
  })
})

router.post("/message", function(req, res, next){
  console.log('trying to send message to ' + req.body._id);
  User.findOne({user:req.session.user}, (err, response) => {
    console.log('sender is ' + response._id);
    Chat.updateOne({_id: req.body._id}, { $push: {content: {sender: response._id, content:req.body.messageContent}}}, function(err, result){
      if(err){
        res.send(err);
      }
      else{
        res.send(JSON.stringify(result));
      }
    })
  })
})

router.get("/allChats", function(req, res, next){
  User.findOne({user: req.session.user}, (err, response) => {
        Chat.find({users: response._id} , (err, chats) => {
          console.log('user id is ' + response._id);
          var userMap = {}
          User.find({}, function (err, users) {
            users.forEach((user)=>{
                userMap[user._id] = user.user;
            })
            console.log('users are' + JSON.stringify(userMap))
            //this line converts the users to their usernames
            let out = chats.map((chat)=>({_id: chat._id, content: chat.content, users: chat.users.map((user)=>userMap[user])}))
            console.log('chats are' + JSON.stringify(out))
            res.send(JSON.stringify(out))
          });
      })
  })

})

router.post("/getChat", function(req, res, next){
    console.log('looking for ' + req.body._id)
    Chat.findOne({_id: req.body._id} , (err, chat) => {
        if(err){
          res.send(JSON.stringify(err))
        }
        else{
          var userMap = {}
          User.find({}, function (err, users) {
            users.forEach((user)=>{
                userMap[user._id] = user.user;
            })
            let out = chat.content.map((message)=>({content: message.content, sender: userMap[message.sender]}))
            res.send(JSON.stringify({_id: chat._id, users:chat.users, content: out}));
          }
          )
        }
    })
})

router.get("/getUsername", function(req, res, next){
    console.log('looking for ' + req.query.username)
    User.find({user: {$regex: `^${req.query.username}`, $options:'i'}}, '_id user', (err, users) => {
        if(err){
          res.send(JSON.stringify(err))
        }
        else{
          res.send(JSON.stringify(users));
        }
    }).limit(5);
})
//
// router.get('/logout', isAuthenticated, function(req, res, next) {
//   req.session = null;
//   res.redirect('/');
// })

module.exports = router
