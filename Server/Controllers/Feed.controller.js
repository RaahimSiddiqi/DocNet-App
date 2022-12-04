const Feed = require("../Model/Feed.model");
const asyncWrapper = require('../middleware/async')


const CreatePost = (req, res) => {
    Feed.createPost.service({ ...req.body, userName: req.user.userName }, (dbError, data) => {
        if (dbError) {
            return res.status(400);
        }
        res.status(200).json(data);
    });
}


const UpdatePost = (req, res) => {
    Feed.updatePost.service({ ...req.body, userName: req.user.userName }, (dbError, data) => {
        if (dbError) {
            return res.status(400);
        }
        res.status(200).json(data);
    });
}


const SearchPostById = asyncWrapper(async (req, res) => {
    Feed.getPostbyPostId.service(req.params, (dbError, data) => {
        if (dbError) {
            res.status(400).json({
                errorCode: "db/unknown-error",
            });
        }
        else
            res.status(200).json({
                data : data
            });
    });
})


const GetFeed = asyncWrapper(async (req, res) => {
    Feed.getFeed.service(req.params, (dbError, data) => {
        if (dbError) {
            res.status(400).json({
                errorCode: "db/unknown-error",
            });
        }
        else
            res.status(200).json({
                data : data
            });
    });  
})


module.exports = {
    UpdatePost,
    GetFeed,
    SearchPostById,
    CreatePost
}


