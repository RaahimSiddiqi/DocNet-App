const { checkSchema } = require('express-validator');
const db = require('./../DB');

const Comment = {};


Comment.schema = {
    commentId: {
        isInt: true
    },
    parentCommentId: {
        isInt: true
    },
    postId: {
        isInt: true
    },
    userName: {
        isString: true,
        isLength: {
            options: {
                min: 3
            }
        }
    },
    body: {
        isString: true,
        isLength: {
            options: {
                min: 1
            }
        }
    },
    upvotes: {
        isInt: true,
    },
    creationTime: {
        isDate: true
    }
}

Comment.addCommentToPost = new function(){
    this.params = ["parentCommentId", "postId", "body"];
    this.service = (data, results) => {
        let sql = "INSERT INTO Comment(parentCommentId, userName, postId, body) VALUES(?, ?, ?, ?)";
        db.query(sql, [data.parentCommentId, data.userName, data.postId, data.body], (err, data) => results(!err ? null : err, data));
    };
}

Comment.editComment = new function(){
    this.params = ["commentId", "body"];
    this.service = (data, results) => {
        let sql = "UPDATE Comment SET body = ? WHERE commentId = ?";
        db.query(sql, [data.body. data.commentId], (err, data) => results(!err ? null : err, data));
    };
}

Comment.deleteComment = new function(){
    this.params = ["commentId"];
    this.service = (data, results) => {
        let sql = "DELETE FROM Comment WHERE commentId = ?";
        db.query(sql, [data.commentId], (err, data) => results(!err ? null : err, data));
    }
}

Comment.getCommentsByPostID = new function(){
    this.params = ["postId"];
    this.service = (data, results) => {
        let sql = "SELECT * FROM Comment WHERE postId = ?";
        db.query(sql, [data.postId], (err, data) => results(!err ? null : err, data));
    };
}

Comment.getCommentsByUserName= new function(){
    this.params = ["userName"];
    this.service = (data, results) => {
        let sql = "SELECT * FROM Comment WHERE userName = ?";
        db.query(sql, [data.userName], (err, data) => results(!err ? null : err, data));
    };
}

module.exports = Comment;