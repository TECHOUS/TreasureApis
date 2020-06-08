const express 	= require('express');
const path 		= require('path');

const app = express();

// express middleware handling the body parsing 
app.use(express.json());

// express middleware handling the form parsing
app.use(express.urlencoded({extended: false}));

// set static web application
app.use(express.static(path.join(__dirname,'public')));

// set the api version 1 path to routes folder
app.use('/api/v1/search',require('./routes/api/v1/search'));

// set the api version 2 path to routes folder
app.use('/api/v2/search',require('./routes/api/v2/search'));

// for invalid routes
app.get("*", (req,res)=>{
    res.status(400).json({
        message: "Bad Request!!! Try any valid API",
        status: 400
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});