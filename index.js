/**
 * API LIST
 * 
 * /api/search					"query_string" : {"default_field" : "name", "query" : "BOOTSTRAP*"}
 * /api/search/:description		"query_string" : {"default_field" : "description", "query" : "*Modular JavaScript*"}
 * /api/search/:docs				
 */
const Appbase = require("appbase-js");
const express = require('express');

var appbaseRef = Appbase({
	url: "https://scalr.api.appbase.io",
	app: "treasurejs",
	credentials: "bFCNleTxK:57890652-b8ef-44f4-a4df-9ae811bf9ffd"
})

appbaseRef.search({
    type: "_doc",
    body: {
      query: {
		"query_string" : {"default_field" : "docs", "query" : "https*"}
      }
    }
}).then(response => {
	let arr = response.hits.hits;
	for(let i=0;i<arr.length;i++)
	{
		let object = arr[i]["_source"]; 
		
		object.other = JSON.parse(object.other);
		console.log(object);
	}
}).catch(error => {
    console.log("Error: ", error)
});
