#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Post = require('./models/post');
var User = require('./models/user');
var PostComment = require('./models/postcomment');
var PrivateMessage = require('./models/privatemessage');



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Posts = [];
var Users = [];
var PostComments = [];
var PrivateMessages = [];

function userCreate(email, firstName, lastName, password, date_of_birth, friends, friendRequestRecieved, friendRequestSent, cb){
    
    userDetail = {email, firstName, lastName, password, date_of_birth, friends, friendRequestRecieved, friendRequestSent };
    var user = new User(userDetail);

    user.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New User: ' + user);
        Users.push(user);
        cb(null, user);
    });
}

function postCreate(author, description, date_of_post, likes, comments, cb){
    postDetail = {author, description, date_of_post, likes, comments};
    var post = new Post(postDetail);

    post.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New Post: ' + post);
        Posts.push(post);
        cb(null, post);
    });
}

function commentCreate(author, text, date_of_post, cb){
    commentDetail = {author, text, date_of_post};
    var comment = new PostComment(commentDetail);

    comment.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New Comment: ' + comment);
        PostComments.push(comment);
        cb(null, comment);
    });
}

function messageCreate(author, userRecieved, text, date_of_post, cb){
    messageDetail = {author, userRecieved, text, date_of_post};
    var message = new PrivateMessage(messageDetail);

    message.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New Message: ' + message);
        PrivateMessages.push(message);
        cb(null, message);
    });
}

//--------

function createUsers(cb) {
    async.parallel([
        function(callback){
            userCreate('ddnguyen94@gmail.com', 'David', 'Nguyen', "password1234", "1960-01-01", [], [], [], callback)
        },
        function(callback){
            userCreate('ddnguyen95@gmail.com', 'Diana', 'Nguyen', "password1234", "1960-01-01", [], [], [], callback)
        },
        function(callback){
            userCreate('ddnguyen96@gmail.com', 'Kenny', 'Nguyen', "password1234", "1960-01-01", [], [], [], callback)
        },
        function(callback){
            userCreate('ddnguyen97@gmail.com', 'Donna', 'Nguyen', "password1234", "1960-01-01", [], [], [], callback)
        }
    ],
    cb);
}

function createComments(cb) {
    async.parallel([
        function(callback){
            commentCreate(Users[0], 'First Comment', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[1], 'Second Comment', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[2], 'Third Comment', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[3], 'HI Buddy', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[1], 'I hate you', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[3], 'Blank', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[2], 'Cool', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[0], 'bye', "2021-07-29", callback)
        },
        function(callback){
            commentCreate(Users[0], 'last Comment', "2021-07-29", callback)
        },
    ],
    cb);
}

function createPosts(cb) {
    async.parallel([
        function(callback){
            postCreate(Users[0], 'First Post', "2021-07-29", [Users[0], Users[3]], [PostComments[0], PostComments[1]], callback)
        },
        function(callback){
            postCreate(Users[2], 'Second Post', "2021-07-29", [Users[2], Users[1]], [PostComments[2], PostComments[3]], callback)
        }
    ],
    cb);
}

function createMessages(cb) {
    async.parallel([
        function(callback){
            messageCreate(Users[0], Users[1], 'Hi User 1, How are you doing?', "2021-07-29", callback)
        },
        function(callback){
            messageCreate(Users[1], Users[2], 'God User 0 is annoying me', "2021-07-29", callback)
        },
        function(callback){
            messageCreate(Users[3], Users[0], 'Hi User 1', "2021-07-29", callback)
        }
    ],
    cb);
}


async.series([
    createUsers,
    createComments,
    createPosts,
    createMessages
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
