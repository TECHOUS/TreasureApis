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

mongoose.connect("mongodb+srv://GauravWalia:WALIAa@1998@mycluster-uxeui.mongodb.net/test", {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Connection error:'));

/**
 * API:
 * url: /api/search
 * method: GET
 * request
 * {
 *      "find": "moment"
 * } 
 **/
router.get('/',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.body.find.toUpperCase();
        let size = req.body.size;
        let exact = req.body.exact;
        let projection = req.body.projection;
        callMongoDbAtlasAPIv2(res, find, "name", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/search/description
 * method: GET
 * request
 * {
 *      find: "mo"
 * } 
 **/
router.get('/description',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.body.find.toUpperCase();
        let size = req.body.size;
        let exact = req.body.exact;
        let projection = req.body.projection;
        callMongoDbAtlasAPIv2(res, find, "description", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/search/docs
 * method: GET
 * request
 * {
 *      find: "mo"
 * } 
 **/
router.get('/docs',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.body.find.toUpperCase();
        let size = req.body.size;
        let exact = req.body.exact;
        let projection = req.body.projection;
        callMongoDbAtlasAPIv2(res, find, "docs", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/search/website
 * method: GET
 * request
 * {
 *      find: "mo"
 * } 
 **/
router.get('/website',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.body.find.toUpperCase();
        let size = req.body.size;
        let exact = req.body.exact;
        let projection = req.body.projection;
        callMongoDbAtlasAPIv2(res, find, "website", size, exact, projection);
    }
});

/**
 * API:
 * url: /api/search/github
 * method: GET
 * request
 * {
 *      find: "mo"
 * } 
 **/
router.get('/github', (req, res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.body.find.toUpperCase();
        let size = req.body.size;
        let exact = req.body.exact;
        let projection = req.body.projection;
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
    if(Array.isArray(req.body))                                         // if the request send is an array
    {
        res.status(404).json({message: "Array is unacceptable"});
        return false;
    }
    else if(!req.body || !req.body.find)                                             // if the request don't contain the find field
    {
        res.status(404).json({message : "Request properties invalid"});
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
    if(responseSize==null || responseSize<=0){
        responseSize=1000;
    }
    if(exact==null || (typeof exact !== "boolean")){
        exact = false;
    }
    if(!Array.isArray(projection)){
        projection = null;
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