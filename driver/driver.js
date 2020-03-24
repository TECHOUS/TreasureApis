const myModel = require('../models/myModel');
const mongoose = require('mongoose');
let fs = require('fs');

mongoose.connect("mongodb+srv://GauravWalia:WALIAa@1998@mycluster-uxeui.mongodb.net/test", {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error',console.error.bind(console, 'Connection error:'));

function addRows()
{
   let charArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
   //parsing and adding new data to mongo db atlas
   for(let i=0;i<charArray.length;i++)
   {
      let objectDatabase = [];
      let readFileName = 'Treasure-js/etc/'+charArray[i]+".md";       // reading files path

      fs.readFile(readFileName,function(err,buf){                     // reading markdown files
         if(err)
         {
            console.log(err);
         }
         let readedFile      = buf.toString();
         let arr             = readedFile.split('\n');
         let object          = null;

         // MARKDOWN PARSING
         for(let j=0;j<arr.length;j++)                               // parsing markdown and create objects
         {
            if(arr[j].search("## :rocket:")!=-1)
            {    
                  if(object!=null)
                  {
                     objectDatabase.push(object);
                  }
                  object = {
                     name :"",
                     description:"",
                     github:"",
                     website:"",
                     docs:"",
                     other:[]
                  }
                  let name = arr[j].split("## :rocket:")[1];
                  object.name = name.substring(1,name.length); 
            }
            else if(arr[j].search("GITHUB")!=-1)
            {
                  let str = arr[j].split("GITHUB")[1];
                  object.github = str.substring(2,str.length-1); 
            }
            else if(arr[j].search("WEBSITE")!=-1)
            {
                  let website = arr[j].split("WEBSITE")[1];
                  object.website = website.substring(2,website.length-1);
            }
            else if(arr[j].search("DEVDOCS")==-1 && arr[j].search("DOCS")!=-1)
            {
                  let docs = arr[j].split("DOCS")[1];
                  object.docs = docs.substring(2,docs.length-1);
            }
            else if(arr[j].indexOf("*")!=-1)
            {
               let pair = {
                  name: "",
                  link: ""
               }
               let parse = arr[j].split(/([()])/);
               let first  = parse[0].replace('* [','').replace(']','');
               pair.name = first;
               pair.link = parse[2];
               object.other.push(pair);
            }
            else                                                            // writing description
            {
               let array = arr[j].split("## :rocket:");
               if(array.length==1 && array[0]!='' && array[0].search("#")==-1)
               {
                  array[0] = array[0].replace(/"/g, "'");
                  object.description = array[0];
               }
            }
         }
         objectDatabase.push(object);                                        // pushing last created object

         rowId = writeData(objectDatabase);
      });
   }
} 

addRows();

function writeData(objectDatabase){

   for(let i=0;i<objectDatabase.length;i++){
      let object = new myModel(
         objectDatabase[i]
      );

      myModel.find((err, data)=>{
         if(err)
         {
            throw err;
         }
         // console.log(data);
         object.save((err, object)=>{
            if(err)
            {
               console.log(err.message);
            }else{
               console.log("data added for" + objectDatabase[i].name);
            }
         });
      })
   }
}