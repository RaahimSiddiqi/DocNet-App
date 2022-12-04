const { query, checkSchema, check } = require('express-validator');
const db = require('./../DB');

const Feed = {};
Feed.schema = {
    postId : {
        isInt : true,
    },    
    userName : {
        isString : true,
        isLength : {
            options : {
                min : 3
            }
        }
    },
    title : {
        isString : true,
    },
    category : {
        isString : true,
    },
    body : {
        isString : true,
    },
    creationTime: {

    }
};
    
Feed.createPost = new function(){
    this.params = ["postId", "userName", "title", "category", "body", "creationTime"];
    this.service = (data, results) => {

        const sql = 'INSERT INTO Post(postId, userName, title, category, body, creationTime) values(?, ?, ?, ?, ?, str_to_date(?, \'%Y-%m-%d\'))';
        db.query(sql, [data.postId, data.userName, data.title, data.category, data.body, data.creationTime], (err, data) => {
            if(err){
                console.log(err)
            }else{
                console.log("Successfully created Post!")
            }
            results(!err? null : err, data);
        });
    };
};



Feed.updatePost = new function(){
    this.params = ["postId", "title", "category", "body"];
    this.service = (data, results) => {
        const { userName, postId, ...restData } = data;
        let sql = "UPDATE POST SET " + Object.keys(restData).join(" = ? ,") +" = ? WHERE userName = ? AND postId = ? ";
        db.query(sql, [...Object.values(restData), userName, postId], (err, data) => {
            results(!err ? null : err, data);
        });
    }
};


Feed.getPosts = new function(){
    this.params = []
    this.service = (data, results) => {
        const sql = `SELECT * FROM POST`;
        db.query(sql, [], (err, data) => {
            if(err){
                console.log(err)
            }
            else{

            }
            results(!err? null : err, data);
        });
    };
};


Feed.getPostbyPostId = new function(){
    this.params = ["postId"]
    this.service = (data, results) => {
        const sql = `SELECT * FROM POST WHERE postId = ?`;
        db.query(sql, [data.postId], (err, data) => {
            if(err){
                console.log(err)
            }
            else{

            }
            results(!err? null : err, data);
        });
    };
};




module.exports = Feed;