const express = require('express');
const { validationResult } = require('express-validator');
const Feed = require('../Model/Feed.model');
const Validate = require('../MiddleWare/Validate');
const Authenticate = require('../MiddleWare/Authenticate')
const FeedController = require('../Controllers/Feed.controller');
const{
    UpdatePost,
    GetFeed,
    SearchPostById,
    CreatePost
} = require('../Controllers/Feed.controller');

const Router = express.Router();

Router.route('/getPost').get(SearchPostById)
Router.route('/getFeed').get(GetFeed);
Router.route('/createPost').post(Authenticate, Validate(Feed.schema, Feed.createPost.params), CreatePost);
Router.route('/editPost').post(Authenticate, Validate(Feed.schema, Feed.updatePost.params), UpdatePost);


module.exports = Router;