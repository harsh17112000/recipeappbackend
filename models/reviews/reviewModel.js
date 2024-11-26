const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeReviewSchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    recipeid:{
        type:Schema.Types.ObjectId,
        ref:"recipes",
        required:true
    },
    username:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true});

// model
const reviewDB = new mongoose.model("reviews",recipeReviewSchema);
module.exports = reviewDB