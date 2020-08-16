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

// excluding dotenv config from production
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// appbase reference for connection
var appbaseRef = Appbase({
	url: process.env.APPBASE_URL,
	app: process.env.APPBASE_APP,
	credentials: process.env.APPBASE_CREDENTIALS
})

/**
 * API:
 * @endpoint: /api/v1/search
 * @url: https://treasurejsapi.herokuapp.com/api/v1/search?find=m
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * query paramaters
 * @param find
 * @param size
 * @param count
 * 
 * @return response
 **/
router.get('/',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, count} = req.query;
        callAppbaseAPIv1(res, find.toUpperCase(), "name", size, count);
    }
});

/**
 * API:
 * @endpoint: /api/v1/search/description
 * @url: https://treasurejsapi.herokuapp.com/api/v1/search/description?find=mo
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * query parameters
 * @param find
 * @param size
 * @param count
 * 
 * @return response
 **/
router.get('/description',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, count} = req.query;
        callAppbaseAPIv1(res, find.toUpperCase(), "description", size, count);
    }
});

/**
 * API:
 * @endpoint: /api/v1/search/docs
 * @url: https://treasurejsapi.herokuapp.com/api/v1/search/docs?find=mo
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * query parameters
 * @param find
 * @param size
 * @param count
 * 
 * @return response
 **/
router.get('/docs',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, count} = req.query;
        callAppbaseAPIv1(res, find.toUpperCase(), "docs", size, count);
    }
});

/**
 * API:
 * @endpoint: /api/v1/search/website
 * @url https://treasurejsapi.herokuapp.com/api/v1/search/website?find=https
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * query parameters
 * @param find
 * @param size
 * @param count
 * 
 * @return response
 **/
router.get('/website',(req,res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, count} = req.query;
        callAppbaseAPIv1(res, find.toUpperCase(), "website", size, count);
    }
});

/**
 * API:
 * @endpoint: /api/search/github
 * @url: https://treasurejsapi.herokuapp.com/api/v1/search/github?find=react
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * query parameters
 * @param find
 * @param size
 * @param count
 * 
 * @return response
 **/
router.get('/github', (req, res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, count} = req.query;
        callAppbaseAPIv1(res, find.toUpperCase(), "github", size, count);
    }
})

/**
 * API:
 * @endpoint: /api/search/other
 * @url: https://treasurejsapi.herokuapp.com/api/v1/search/other?find=react
 * 
 * @method GET
 * @access public
 * @author techous
 * 
 * query parameters
 * @param find
 * @param size
 * @param count
 * 
 * @return response
 **/
router.get('/other', (req, res)=>{
    if(handleInvalidRequest(req, res)){
        const {find, size, count} = req.query;
        callAppbaseAPIv1(res, find.toUpperCase(), "other", size, count);
    }
})

/**
 * This function handles the invalid request
 * 
 * @param req request to handle
 * @param res response to send back
 * @author techous
 * @return 
 **/
function handleInvalidRequest(req, res){
    if(!req.query.find || req.query.find === '')                                             // if the request don't contain the find field
    {
        res.status(400).json({message : "Request Parameters Invalid"});
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
 * 
 * @author techous
 **/
function callAppbaseAPIv1(res, find, field, responseSize, count){
    
    if(!responseSize || parseInt(responseSize)<=0 || isNaN(responseSize)){
        responseSize=1000;
    }else{
        responseSize = parseInt(responseSize);
    }

    if(!count){
        count = false;
    }else{
        count = (count == 'true');
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

        res.header("Access-Control-Allow-Origin","*")
        if(count){
            res.json({totalCount: arr.length})
        }else{
            let result = [];
            if(arr!=null && arr.length > 0){
                for(let i=0;i<arr.length;i++){
                    arr[i]._source.other = JSON.parse(arr[i]._source.other);
                    result.push(arr[i]._source);
                }
            }    
            res.json(result);
        }
        
    }).catch(error => {
        console.log("Error in "+field+" API: ", error)
    });
}

module.exports = router;