const express = require('express')
var router = express.Router()
var User = require('../models/user-model.js')

router.get('/user/getUsers', function(_, res, next) {
  User.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.send(result);
  })
})

router.get('/users/add', function(req, res, next) {
  console.log("Welcome to the backend");
  console.log("created user");
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
