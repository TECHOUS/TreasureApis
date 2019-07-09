const express 	= require('express');
const path 		= require('path');

const app = express();

// express middleware handling the body parsing 
app.use(express.json());

// express middleware handling the form parsing
app.use(express.urlencoded({extended: false}));

// set static web application
app.use(express.static(path.join(__dirname,'public')));

// set the api path to routes folder
app.use('/api/search',require('./routes/api/search'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});