/**
 * API LIST
 * 
 
 * /api/v1/search
 * /api/v1/search/description
 * /api/v1/search/docs
 * /api/v1/search/website
 * /api/v1/search/github
 * /api/v1/search/other				
 **/

const express = require('express');
const router = express.Router();
const Appbase = require("appbase-js");
require('dotenv').config();

var appbaseRef = Appbase({
	url: process.env.APPBASE_URL,
	app: process.env.APPBASE_APP,
	credentials: process.env.APPBASE_CREDENTIALS
})

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
        callAppbaseAPIv1(res, find, "name", size);
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
        callAppbaseAPIv1(res, find, "description", size);
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
        callAppbaseAPIv1(res, find, "docs", size);
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
        callAppbaseAPIv1(res, find, "website", size);
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
        callAppbaseAPIv1(res, find, "github", size);
    }
})

/**
 * API:
 * url: /api/search/other
 * method: GET
 * request
 * {
 *      find: "Transformers"
 * } 
 **/
router.get('/other', (req, res)=>{
    if(handleInvalidRequest(req, res)){
        let find = req.body.find.toUpperCase();
        let size = req.body.size;
        callAppbaseAPIv1(res, find, "other", size);
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
 * this function will call the treasure - appbase api
 * 
 * @param res response to send response
 * @param find query to find
 * @param field field to search data
 **/
function callAppbaseAPIv1(res, find, field, responseSize){
    if(responseSize==null || responseSize<=0){                                     // if size is not defined in the request it is taken as 1000
        responseSize = 1000;
    }
    find = find+"*";
    appbaseRef.search({
        type: "_doc",
        body: {
            from : 0, 
            size : responseSize,
            query: {
                "query_string" : {"default_field" : field, "query" : find}
            }
        }
    }).then(response => {
        let arr = response.hits.hits;
        let result = [];
        if(arr!=null && arr.length > 0){
            for(let i=0;i<arr.length;i++){
                result.push(arr[i]._source);
            }
        }
        res.json(result);
    }).catch(error => {
        console.log("Error in "+field+" API: ", error)
    });
}

module.exports = router;