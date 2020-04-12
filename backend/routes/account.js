var express = require('express')
var router = express.Router()

var bcrypt = require('bcrypt');
const saltRounds = 10;

var User = require('../models/user-model.js')


router.post('/signup', function(req, res, next) {

  User.find({user: req.body.username}, function(err, result) {
    if (err) {
      res.send(JSON.stringify("Signup failed. Try again later?"))
    } else if (result.length !== 0) {
      res.send(JSON.stringify("Duplicate User"))
    } else {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let user = new User({
          user: req.body.username,
          email: req.body.email,
          first: req.body.firstname,
          last: req.body.lastname,
          pass: hash,
        })

        user.save(function(err) {
          if (!err) {
            req.session.user = req.body.username;
            console.log('success');
            res.send(JSON.stringify("success"));
          } else {
            res.send(JSON.stringify("Signup failed. Try again later?"));
          }
        })
      })
    }
  })

})
router.post('/login', function(req, res, next) {
  console.log('trying to log in with' + req.body.username + ' ' + req.body.password);
  User.findOne({user: req.body.username}, function(err, user) {
    if(!user){
      res.send(JSON.stringify('failure'));
    }
    else {
      bcrypt.compare(req.body.password, user.pass, function(err, result) {
        console.log('result is' + result);
        if(result === true){
          req.session.user = req.body.username;
          console.log('made session ' + req.session.user);
          res.send(JSON.stringify(req.session.user));
        }
        else{
          res.send(JSON.stringify('failure'));
        }
      })
    }
  })
})

router.post('/logout', function(req, res, next){
  req.session.user = null;
  res.send(JSON.stringify("success"));
})

router.get('/current', function(req, res, next){
  console.log('curr user is ' + req.session.user);
  User.findOne({user: req.session.user}, function(err, response){
      console.log('found user');
      if(err || response===null){
          res.send(JSON.stringify("NO USER FOUND"))
      }
      else{
          res.send(JSON.stringify(response))
      }

  })

});
//
// router.get('/logout', isAuthenticated, function(req, res, next) {
//   req.session = null;
//   res.redirect('/');
// })

module.exports = router
