var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function (req,res,next){
    var categories = db.get('categories');
    categories.find({},{}, function (err, categories){
      res.render('addpost', {
          "title": "Add Post",
          "categories": categories
      });
    });
});

router.post('/add', function (req, res, next){
    // Get form values
    var title       = req.body.title;
    var category    = req.body.category;
    var body        = req.body.body;
    var author      = req.body.author;
    var date        = new Date();

    if(req.files.mainimage){
        var mainimageOriginalName       = req.files.mainimage.originalname;
        var mainimageName               = req.files.mainimage.name;
        var mainimageMime               = req.files.mainimage.mimeType;
        var mainimagePath               = req.files.mainimage.path;
        var mainimageExt                = req.files.mainimage.extension;
        var mainimageSize               = req.files.mainimage.size;
     } else {
        var mainimageName = 'noimage.png';
    }

    // form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    //check errors
    var errors = req.validationErrors();
    if(errors){
        res.render('addpost', {
            "errors": errors,
            "title": title,
            "body": body
        });
    } else {
        var posts = db.get('posts');

        //submit to DB
        posts.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainimageName
        }, function (err, post){
            if(err){
                res.send('There was an issue submitting the post');
            } else {
                req.flash('success', 'Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        })
    }
});

module.exports = router;