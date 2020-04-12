const express = require('express')
var router = express.Router()
var User = require('../models/user-model.js')
var Topic = require('../models/topic.js')

router.get('/user/getUsers', function(_, res, next) {
  User.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.send(result);
  })
})

router.get('/add', function(req, res, next) {
  res.send("welcome to the backend")
})

router.get('/watchlist', function(req, res, next){
  User.findOne({_id: req.session.user._id}, 'watchlist', function(err, person) {
    if(err) console.log(err);
    if(person){
        res.send(JSON.stringify({watchlist: person.watchlist}))
    }
    else{
      res.send(JSON.stringify({watchlist: []}))
    }
  })
})

router.post('/watchlist/add', function(req, res, next){
  User.updateOne({_id: req.session.user._id}, { $push: {watchlist: req.body.ticker}}, function(err, person){
    if(err) res.send("Error");
    if(!err) res.send("Success");
  })
})

router.post('/watchlist/remove', function(req, res, next){
  User.updateOne({_id: req.session.user._id}, { $pull: {watchlist: req.body.ticker}}, function(err, person){
    console.log('removed');
    console.log(person.watchlist);
    if(err) res.send("Error");
    if(!err) res.send("Success");
  })
})

router.get('/searchTopics', function(req, res, next){
    Topic.find({name: {$regex: `^${req.query.topic}`, $options:'i'}}, '_id name', (err, topics) => {
        if(err){
          res.send(JSON.stringify(err))
        }
        else{
          res.send(JSON.stringify(topics));
        }
    }).limit(5);
})

router.get('/topics', function(req, res, next){
    User.findOne({_id: req.session.user._id}, 'topics', function(err, person) {
      if(err) console.log(err);
      if(person){
         res.send(JSON.stringify({topics: person.topics}))
      }
      else{
        res.send(JSON.stringify({topics: []}))
      }
    })
})

router.post('/topics/add', function(req, res, next){
  User.update({_id: req.session.user._id}, { $push: {topics: req.body.topic}}, function(err, person){
    if(err) res.send("Error");
    if(!err) res.send("Success");
  })
})

router.post('/topics/remove', function(req, res, next){
  User.update({_id: req.session.user._id}, { $pull: {topics: req.body.topic}}, function(err, person){
    console.log('removed');
    if(err) res.send("Error");
    if(!err) res.send("Success");
  })
})
//
// router.post('/questions/answer', function(req, res, next) {
//   var answerText = req.body.answer;
//   var questionId = req.body.questionId;
//   console.log("answer api called");
//   Question.findOneAndUpdate({_id: questionId}, {answer: answerText}, function(err, result) {
//     if (err) {
//       next(err);
//     }
//     else {
//       console.log('quesiton' + questionId + 'answered with answertext ' + answerText);
//     }
//   });
//
// })

module.exports = router
