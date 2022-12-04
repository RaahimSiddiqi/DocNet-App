require("dotenv").config() /*Loads the environment variables from the .env file. They are stored in process.env object */
const express = require('express');
const User = require('./Routes/User');
const Feed = require('./Routes/Feed');
const Comments = require('./Routes/Comments');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler')
const app = express();

//json parsing based on bodyparser
app.use(express.json());
app.set('json spaces', 2)


app.get('/',(req,res)=>{
    res.send('This is the express server and stuff').status(200);
})

//basic middleware
app.use((req,res,next)=>{
    console.log(`${req.method}:${req.url}`)
    next();
})


app.use('/api', User);
app.use('/posts', Feed);
app.use('/comments', Comments);
//app.use(notFound)
app.use(errorHandlerMiddleware);


//middle wares need to be used before all routes otherwise it doesnt run; it doesnt run for the root route
//root route; can only access this with browser or an API

//log methods and urls to console for debugging




app.listen(8090,()=>{
    console.log("Server has started and listening on port 8090\n");
});