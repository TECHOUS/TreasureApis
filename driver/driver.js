const myModel = require('../models/myModel');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://GauravWalia:WALIAa@1998@mycluster-uxeui.mongodb.net/test", {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error',console.error.bind(console, 'Connection error:'));

var object = new myModel(
   {
      name: "REPO NAME",
      description: "this is description",
      github: "https://github.com",
      website: "https://techous.github.io",
      docs: "https://techous.github.io",
      other: []
   }
);

myModel.find((err,data)=>{
   if(err)
   {
      throw err;
   }
   // console.log(data);
   object.save((err,object)=>{
      if(err)
      {
         console.log(err);
      }
      console.log("data saved");
   });
})