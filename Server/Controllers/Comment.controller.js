const Comment = require("../Model/Comment.model");


module.exports = {

    addComment: (req, res) => {
        Comment.addCommentToPost.service({ ...res.body, userName: req.user.userName }, (dbError, data) => {
            if (dbError) {
                res.status(400).json({
                    errorCode: "db/unknown-error",
                });
            }
            else
                res.sendStatus(200);
        })
    },

    editComment: (req, res) => {
        Comment.editComment.service(req.body, (dbError, data) => {
            if (dbError) {
                res.status(400).json({
                    errorCode: "db/unknown-error",
                });
            }
            else
                res.sendStatus(200);
        })
    },

    deleteComment: (req, res) => {
        Comment.editComment.service(req.params, (dbError, data) => {
            if (dbError) {
                res.status(400).json({
                    errorCode: "db/unknown-error",
                });
            }
            else
                res.sendStatus(200);
        })
    },

    getCommentsByPostId: (req, res) => {
        Comment.getCommentsByPostID.service(req.params, (dbError, data) => {
            if (dbError) {
                res.status(400).json({
                    errorCode: "db/unknown-error",
                });
            }
            else
                res.status(200).json(data);
        })
    },

    getCommentsByUserName: (req, res) => {
        Comment.getCommentsByPostID.service(req.params, (dbError, data) => {
            if (dbError) {
                res.status(400).json({
                    errorCode: "db/unknown-error",
                });
            }
            else
                res.status(200).json(data);
        })
    },
};