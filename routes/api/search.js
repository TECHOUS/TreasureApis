/**
 * API LIST
 * 
 
 * /api/search/:description		"query_string" : {"default_field" : "description", "query" : "*Modular JavaScript*"}
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
 *      find: "hello"
 * } 
 **/
router.get('/',(req,res)=>{
    
    if(Array.isArray(req.body))
    {
        res.status(404).json({message: "Array is unacceptable"});
    }
    else if(!req.body.find)
    {
        res.status(404).json({message : "Request properties invalid"});
    }
    else
    {
        let find = req.body.find.toUpperCase();
        searchData(res, find);        
    }
});

/**
 * It will search data in appbase
 **/
function searchData(res, find)
{
    find = find+"*";
    appbaseRef.search({
        type: "_doc",
        body: {
            query: {
                "query_string" : {"default_field" : "name", "query" : find}
                // match_all: {}
            }
        }
    }).then(response => {
        // console.log(response);
        // let len = response.hits.total.value;
        // console.log(len);

        // let arr = response.hits.hits;
        
        // let result = [];
        // for(let i=0;i<len;i++)
        // {
        //     let object = arr[i]["_source"]; 
        //     console.log(object.name);

            // if(object.name[0]===find.charAt(0) && object.name.substring(0,find.length) === find)
            // {
            //     object.other = JSON.parse(object.other);
            //     result.push(object);
            //     console.log(object);
            // }
        // }
        res.json(response);
    }).catch(error => {
        console.log("Error: ", error)
    });
}

// router.get('/description',(req,res)=>{
//     res.send('description working');
// });

// router.get('/docs',(req,res)=>{
//     res.send('docs working');
// });

module.exports = router;