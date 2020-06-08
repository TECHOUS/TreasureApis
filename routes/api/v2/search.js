/**
 * API LIST
 * 
 * /api/v2/search
 * /api/v2/search/description
 * /api/v2/search/docs
 * /api/v2/search/website
 * /api/v2/search/github			
 **/

const express = require('express');
const router = express.Router();
const myModel = require('../../../models/myModel');
const mongoose = require('mongoose');

// excluding dotenv config from production
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// mongodb connection
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Connection error:'));

/**
 * API:
 * @endpoint: /api/v2/search
 * @url: https://treasurejsapi.herokuapp.com/api/v2/search?find=async
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * Query Parameters
 * @param find - string to search
 * @param size - size of the response
 * @param exact - find with exact match or not
 * @param projection - array of properties
 * 
 * @return response
 **/
router.get('/',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, exact, projection} = req.query;
        callMongoDbAtlasAPIv2(res, find.toUpperCase(), "name", size, exact, projection);
    }
});

/**
 * API:
 * @endpoint: /api/v2/search/description
 * @url: https://treasurejsapi.herokuapp.com/api/v2/search/description?find=mo
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * Query Parameters
 * @param find - string to search
 * @param size - size of the response
 * @param exact - find with exact match or not
 * @param projection - array of properties
 * 
 * @return response
 **/
router.get('/description',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, exact, projection} = req.query;
        callMongoDbAtlasAPIv2(res, find.toUpperCase(), "description", size, exact, projection);
    }
});

/**
 * API:
 * @endpoint: /api/v2/search/docs
 * @url: https://treasurejsapi.herokuapp.com/api/v2/search/docs?find=async
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * Query Parameters
 * @param find - string to search
 * @param size - size of the response
 * @param exact - find with exact match or not
 * @param projection - array of properties
 * 
 * @return response
 **/
router.get('/docs',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, exact, projection} = req.query;
        callMongoDbAtlasAPIv2(res, find.toUpperCase(), "docs", size, exact, projection);
    }
});

/**
 * API:
 * @endpoint: /api/search/website
 * @url: https://treasurejsapi.herokuapp.com/api/v2/search/website?find=async
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * Query Parameters
 * @param find - string to search
 * @param size - size of the response
 * @param exact - find with exact match or not
 * @param projection - array of properties
 * 
 * @return response
 **/
router.get('/website',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, exact, projection} = req.query;
        callMongoDbAtlasAPIv2(res, find.toUpperCase(), "website", size, exact, projection);
    }
});

/**
 * API:
 * @endpoint: /api/search/github
 * @url: https://treasurejsapi.herokuapp.com/api/v2/search/github?find=async
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * Query Parameters
 * @param find - string to search
 * @param size - size of the response
 * @param exact - find with exact match or not
 * @param projection - array of properties
 * 
 * @return response
 **/
router.get('/github', (req, res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, exact, projection} = req.query;
        callMongoDbAtlasAPIv2(res, find.toUpperCase(), "github", size, exact, projection);
    }
})

/**
 * This function handles the invalid request
 * 
 * @param req request to handle
 * @param res response to send back
 **/
function handleInvalidRequest(req, res){
    if(!req.query.find || req.query.find === '' || req.query.find==='*')                                             // if the request don't contain the find field
    {
        res.status(400).json({
            message : "Request Parameters Invalid",
            status: 400
        });
        return false;
    }
    return true;
}

/**
 * this function connect the mongo db atlas and returns the data based on query
 * 
 * @param res response to return back
 * @param find string to search
 * @param field is column which we want to search
 * @param responseSize size of response we want
 * @param exact boolean to check wheter the string is exactly equals
 **/
function callMongoDbAtlasAPIv2(res, find, field, responseSize, exact, projection){
    
    if(!responseSize || parseInt(responseSize)<=0 || isNaN(responseSize)){
        responseSize=1000;
    }else{
        responseSize = parseInt(responseSize);
    }

    if(!exact){
        exact = false;
    }else{
        exact = (exact == 'true');
    }
    
    if(!projection || !Array.isArray(JSON.parse(projection))){
        projection = null;
    }else{
        projection = JSON.parse(projection)
    }
    switch(field){
        case "name":
            searchName(res, find, field, responseSize, exact, projection);
            break;
        case "description":
            searchDescription(res, find, field, responseSize, exact, projection);
            break;
        case "docs":
            searchDocs(res, find, field, responseSize, exact, projection);
            break;
        case "website":
            searchWebsite(res, find, field, responseSize, exact, projection);
            break;
        case "github":
            searchGithub(res, find, field, responseSize, exact, projection);
            break;
    }
}

/**
 * this function searches the name
 * 
 * @param res response to send back
 * @param find string to search
 * @param field name to search
 * @param responseSize
 * @param exact if the match has to be exact
 **/
function searchName(res, find, field, responseSize, exact, projection){
    let expression = "";
    if(exact){
        expression = new RegExp('^' + find + '$', 'i');
    }else{
        // start to end match new RegExp('^'+find+".*")}
        expression = new RegExp('^'+find+".*"); 
    }
    
    myModel.find({name: expression}, projection, {skip:0, limit: responseSize, sort: {name: 1}}, (err, result)=>{
        if(err){
            console.log("Error in "+field+" API: "+err);
        }else{
            res.header("Access-Control-Allow-Origin","*")
            res.json(result);
        }
    })
}

/**
 * this function searches the description
 * 
 * @param res response to send back
 * @param find string to search
 * @param field column to be searched
 * @param responseSize response size to return
 * @param exact if the match has to be exact 
 **/
function searchDescription(res, find, field, responseSize, exact, projection){
    let expression = "";
    if(exact){
        expression = new RegExp('^' + find + '$', 'i');
    }else{
        // search the substring
        expression = new RegExp(find, 'i'); 
    }

    myModel.find({description: expression}, projection, {skip:0, limit: responseSize, sort: {name: 1}}, (err, result)=>{
        if(err){
            console.log("Error in "+field+" API: "+err);
        }else{
            res.header("Access-Control-Allow-Origin","*")
            res.json(result);
        }
    })
}

/**
 * this function searches the docs
 * 
 * @param res response to send back
 * @param find string to search
 * @param field column to be searched
 * @param responseSize response size to return
 * @param exact if the match has to be exact 
 **/
function searchDocs(res, find, field, responseSize, exact, projection){
    let expression = "";
    if(exact){
        expression = new RegExp('^' + find + '$', 'i');
    }else{
        // search the substring
        expression = new RegExp(find, 'i'); 
    }

    myModel.find({docs: expression}, projection, {skip:0, limit: responseSize, sort: {name: 1}}, (err, result)=>{
        if(err){
            console.log("Error in "+field+" API: "+err);
        }else{
            res.header("Access-Control-Allow-Origin","*")
            res.json(result);
        }
    })
}

/**
 * this function searches the description
 * 
 * @param res response to send back
 * @param find string to search
 * @param field column to be searched
 * @param responseSize response size to return
 * @param exact if the match has to be exact 
 **/
function searchWebsite(res, find, field, responseSize, exact, projection){
    let expression = "";
    if(exact){
        expression = new RegExp('^' + find + '$', 'i');
    }else{
        // search the substring
        expression = new RegExp(find, 'i'); 
    }

    myModel.find({website: expression}, projection, {skip:0, limit: responseSize, sort: {name: 1}}, (err, result)=>{
        if(err){
            console.log("Error in "+field+" API: "+err);
        }else{
            res.header("Access-Control-Allow-Origin","*")
            res.json(result);
        }
    })
}

/**
 * this function searches the description
 * 
 * @param res response to send back
 * @param find string to search
 * @param field column to be searched
 * @param responseSize response size to return
 * @param exact if the match has to be exact 
 **/
function searchGithub(res, find, field, responseSize, exact, projection){
    let expression = "";
    if(exact){
        expression = new RegExp('^' + find + '$', 'i');
    }else{
        // search the substring
        expression = new RegExp(find, 'i'); 
    }

    myModel.find({github: expression}, projection, {skip:0, limit: responseSize, sort: {name: 1}}, (err, result)=>{
        if(err){
            console.log("Error in "+field+" API: "+err);
        }else{
            res.header("Access-Control-Allow-Origin","*")
            res.json(result);
        }
    })
}

module.exports = router;