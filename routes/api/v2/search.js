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
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Connection error:'));

/**
 * API:
 * url: /api/v2/search
 * method: GET
 * 
 * request: https://treasurejsapi.herokuapp.com/api/v2/search?find=async  
 **/
router.get('/',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.query.find.toUpperCase();
        let size = req.query.size;
        let exact = req.query.exact;
        let projection = req.query.projection;
        callMongoDbAtlasAPIv2(res, find, "name", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/v2/search/description
 * method: GET
 * 
 * request: https://treasurejsapi.herokuapp.com/api/v2/search/description?find=mo
 **/
router.get('/description',(req,res)=>{
    console.log(req.query);
    if(handleInvalidRequest(req, res)){
        let find = req.query.find.toUpperCase();
        let size = req.query.size;
        let exact = req.query.exact;
        let projection = req.query.projection;
        callMongoDbAtlasAPIv2(res, find, "description", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/v2/search/docs
 * method: GET
 * 
 * request: https://treasurejsapi.herokuapp.com/api/v2/search/docs?find=async
 **/
router.get('/docs',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.query.find.toUpperCase();
        let size = req.query.size;
        let exact = req.query.exact;
        let projection = req.query.projection;
        callMongoDbAtlasAPIv2(res, find, "docs", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/search/website
 * method: GET
 * 
 * request: https://treasurejsapi.herokuapp.com/api/v2/search/website?find=async 
 **/
router.get('/website',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.query.find.toUpperCase();
        let size = req.query.size;
        let exact = req.query.exact;
        let projection = req.query.projection;
        callMongoDbAtlasAPIv2(res, find, "website", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/search/github
 * method: GET
 * 
 * request: https://treasurejsapi.herokuapp.com/api/v2/search/github?find=async
 **/
router.get('/github', (req, res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.query.find.toUpperCase();
        let size = req.query.size;
        let exact = req.query.exact;
        let projection = req.query.projection;
        callMongoDbAtlasAPIv2(res, find, "github", size, exact, projection);
    }
})

/**
 * This function handles the invalid request
 * 
 * @param req request to handle
 * @param res response to send back
 **/
function handleInvalidRequest(req, res){
    if(!req.query || !req.query.find || req.body.find === '')                                             // if the request don't contain the find field
    {
        res.status(404).json({message : "Request parameters invalid"});
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
            res.json(result);
        }
    })
}

module.exports = router;