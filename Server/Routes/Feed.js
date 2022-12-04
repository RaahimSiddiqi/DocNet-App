const express = require('express');
const { validationResult } = require('express-validator');
const Feed = require('../Model/Feed.model');
const Validate = require('../MiddleWare/Validate');
const FeedController = require('../Controllers/Feed.controller');
const{
    
} = require('../Controllers/Feed.controller')



const Router = express.Router();

Router.route('/getPosts').get(Authenticate, Validate(Feed.schema, Feed.createFeed.params), Register);
Router.route('/createPost').get(Authenticate, Validate(Feed.schema, Feed.getFeedByFeedName.params),SearchByName);
Router.route('/editPost').post(Authenticate, Validate(Feed.schema, Feed.signIn.params),signIn);


module.exports = Router;