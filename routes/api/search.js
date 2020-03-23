/**
 * API LIST
 * 
 
 * /api/search/description/:Modular		"query_string" : {"default_field" : "description", "query" : "*Modular JavaScript*"}
 * /api/search/:docs				
 */

const express = require('express');
const router = express.Router();
const Appbase = require("appbase-js");

var appbaseRef = Appbase({
	url: "https://scalr.api.appbase.io",
	app: "treasurejs",
	credentials: "bFCNleTxK:57890652-b8ef-44f4-a4df-9ae811bf9ffd"
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
        searchNameData(res, find, size);
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
        searchDescriptionData(res, find, size);
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
        searchDocsData(res, find, size);
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
        searchWebsiteData(res, find, size);
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
        searchGithubData(res, find, size);
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
        searchOtherData(res, find, size);
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

/**
 * It will search name data in appbase
 * 
 * @param res response to return
 * @param find name data to find
 **/
function searchNameData(res, find, size){
    callAppbaseAPIv1(res, find, "name", size);
}

/**
 * It will search description data in appbase
 * 
 * @param response to return
 * @param find description data to find 
 **/
function searchDescriptionData(res, find, size){
    callAppbaseAPIv1(res, find, "description", size);
}

/**
 * This function searches the docs data in appbase
 * 
 * @param res response to send back
 * @param find docs data to find
 **/
function searchDocsData(res, find, size){
    callAppbaseAPIv1(res, find, "docs", size);
}

/**
 * This function searches the website data in appbase
 * 
 * @param res response to send back
 * @param find website data to find
 **/
function searchWebsiteData(res, find, size){
    callAppbaseAPIv1(res, find, "website", size);
}

/**
 * this function searches the github data in appbase
 * 
 * @param res response to send back
 * @param find github data to find
 **/
function searchGithubData(res ,find, size){
    callAppbaseAPIv1(res, find, "github", size);
}

/**
 * This function searches the other data in appbase
 * 
 * @param res response to send back 
 * @param find other data to find
 */
function searchOtherData(res, find, size){
    callAppbaseAPIv1(res, find, "other", size);
}

module.exports = router;