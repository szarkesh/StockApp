var express = require('express')
var router = express.Router()
var User = require('../models/user.js')
var isAuthenticated = require('../middlewares/isAuthenticated.js');



router.get('/signup', function(req, res) {
  res.render('signup', {layout: false})
});

router.get('/login', function(req, res) {
  res.render('login', {layout: false})
});
// router.get('/logout', function(req, res) {
//   ...
// })
router.post('/signup', function(req, res, next) {
  console.log('hello!')
  let user = new User({
    username: req.body.username,
    password: req.body.password
  })
  User.find({username: req.body.username}, function(err, result) {
    if (err) {
      next(err);
    } else if (result.length !== 0) {
      next(new Error('Duplicate User'));
    } else {
      user.save(function(err) {
        if (!err) {
          res.redirect('/account/login')
        } else {
          next(err)
        }
      })
    }
  })

})
router.post('/login', function(req, res, next) {
  User.find({username: req.body.username, password: req.body.password}, function(err, results) {
    console.log(results);
    if (err) {
      return next(err);
    } else if (results.length === 0) {
      return next(new Error('User not found'));
    } else {
      req.session.user = results[0].username;
      res.redirect('/');
    }
  })
})

router.get('/logout', isAuthenticated, function(req, res, next) {
  req.session = null;
  res.redirect('/');
})

module.exports = router
