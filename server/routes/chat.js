var express = require('express')
var router = express.Router()

var bcrypt = require('bcrypt');
const saltRounds = 10;

var User = require('../models/user-model.js')
var Chat = require('../models/chat.js')


router.post("/create", function(req, res, next){
  User.findOne({user: req.session.user}, function(err, user){
    let arr = [...req.body.ids, user._id];
    var newChat = Chat({users: arr, messages:[]});
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
  User.findOne({user:req.session.user}, (err, response) => {
    Chat.updateOne({_id: req.body._id}, { $set: { seeners: [req.session.user], last_message: {sender: response._id, content:req.body.messageContent}},$push: {content: {sender: response._id, content:req.body.messageContent}}}, function(err, result){
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
        Chat.find({users: response._id} , '_id last_message seeners users', function(err, chats){
          var userMap = {}
          User.find({}, function (err, users) {
            users.forEach((user)=>{
                userMap[user._id] = user.user;
            })
            let out = chats.map((chat)=>({_id: chat._id, seen: (chat.seeners!==undefined ? chat.seeners.includes(req.session.user) : false),
                                        last_message: chat["last_message"] ? {sender: userMap[chat["last_message"].sender]
                                                                            , content: chat["last_message"].content,
                                                                            time: chat["last_message"].time} : undefined
                                        , users: chat.users.filter((user)=>userMap[user]!==req.session.user).map((user)=> userMap[user])}))
            res.send(JSON.stringify(out))
          });
      })
  })

})

router.post("/getChat", function(req, res, next){
    Chat.findOneAndUpdate({_id: req.body._id} , {$addToSet: {seeners: req.session.user}},(err, chat) => {
        if(err){
          res.send(JSON.stringify(err))
          console.log(JSON.stringify(err))
        }
        else{
          var userMap = {}
          User.find({}, function (err, users) {
            users.forEach((user)=>{
                userMap[user._id] = user.user;
            })
            let out = chat.content.map((message)=>({content: message.content, sender: userMap[message.sender], time:message.time}))
            let parsedTypers = chat.typers.filter((user)=>userMap[user]!==req.session.user).map((user)=>userMap[user])
            res.send(JSON.stringify({_id: chat._id, typers:parsedTypers, users:chat.users, content: out}));
          }
          )
        }
    })
})

router.get("/getUsername", function(req, res, next){
    User.find({user: {$regex: `^${req.query.username}`, $options:'i'}}, '_id user', (err, users) => {
        for (var i = 0; i < users.length; i++) {
            var obj = users[i];
            if (users[i].user === req.session.user) {
                users.splice(i, 1);
            }
        }
        if(err){
          res.send(JSON.stringify(err))
        }
        else{
          res.send(JSON.stringify(users));
        }
    }).limit(5);
})

router.post("/addTyper", function(req, res, next){
    User.findOne({user: req.session.user}, (err, user) => {
        Chat.findOneAndUpdate({_id:req.body._id}, {$addToSet:{typers:user._id}}, function(err, chat){
            if(err){
                res.send(JSON.stringify(err))
            }
            else{
                res.send('success');
            }
        })
    })
})

router.post("/removeTyper", function(req, res, next){
    User.findOne({user: req.session.user}, (err, user) => {
        Chat.findOneAndUpdate({_id:req.body._id}, {$pull:{typers:user._id}}, function(err, chat){
            if(err){
                res.send(JSON.stringify(err))
            }
            else{
                res.send('success');
            }
        })
    })
})

router.post("/addSeener", function(req, res, next){
    User.findOne({user: req.session.user}, (err, user) => {
        Chat.findOneAndUpdate({_id:req.body._id}, {$addToSet:{seeners:user._id}}, function(err, chat){
            if(err){
                res.send(JSON.stringify(err))
            }
            else{
                res.send('success');
            }
        })
    })
})
//
// router.get('/logout', isAuthenticated, function(req, res, next) {
//   req.session = null;
//   res.redirect('/');
// })

module.exports = router
