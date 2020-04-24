const express = require('express')
var router = express.Router()
var User = require('../models/user-model.js')
var Topic = require('../models/topic.js')
const Busboy = require('busboy')
const AWS = require('aws-sdk')
const uuid = require('uuid/v1')

const AWS_ACCESS_KEY = process.env.AWS_ACCESS || require('../../config.js').iamUser;
const AWS_SECRET_KEY = process.env.AWS_SECRET || require('../../config.js').iamSecret;

function uploadToS3(file, name){
    let s3bucket = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        Bucket: "avana-io-bucket"
    })
    s3bucket.createBucket(function(){
        var params = {
            Bucket: "avana-io-bucket",
            Key: name,
            Body: file.data
        };
        s3bucket.upload(params, function(err, data){
            if(err){
                console.log('error in callback');
                console.log(err);
            }
            console.log('success');
            console.log(data);
        })
    })
}

router.get('/user/getUsers', function(_, res, next) {
  User.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.send(result);
  })
})

router.post('/upload', function(req, res, next){
    const element1 = req.body.element1;
    var busboy = new Busboy({headers: req.headers});
    console.log('getting upload')
    busboy.on('finish', function(){
         console.log("upload finihsed")
         const file = req.files.element2;
         console.log(file)
         const fileName = uuid()+'.png';
         uploadToS3(file, fileName);
         res.send(JSON.stringify(fileName));
     })
    req.pipe(busboy);
})

router.get('/getFile', function(req, res, next){
    let s3bucket = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        Bucket: "avana-io-bucket"
    })
    s3bucket.createBucket(function(){
        var params = {
            Bucket: "avana-io-bucket",
            Key: req.query.filename,
        };
        s3bucket.getObject(params, function(err, data){
            if(err){
                console.log('error in callback');
                console.log(err);
            }
            if(data){
                res.send(data.Body);
            }
            else{
                res.send(null);
            }
        })
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
