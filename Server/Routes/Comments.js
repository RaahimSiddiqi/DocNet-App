const express = require('express');
const Comment = require('../Model/Comment.model');
const Validate = require('../MiddleWare/Validate');
const Authenticate = require('../MiddleWare/Authenticate')
const CommentController = require("../Controllers/Comment.controller");

const Router = express.Router();

Router.route('/getComments/:postId').get(Validate(Comment.schema, Comment.getCommentsByPostID.params), CommentController.getCommentsByPostId);
Router.route('/addComment').post(Validate(Comment.schema, Comment.addCommentToPost.params), CommentController.addComment);


module.exports = Router;