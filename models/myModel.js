const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String
    },
    github: {
        type: String
    },
    website: {
        type: String
    },
    docs: {
        type: String
    },
    other: {
        type: Array
    }
});

module.exports = mongoose.model('myModel',myModel);