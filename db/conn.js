const mongoose = require("mongoose");

const DB = process.env.DB_CONNECTION 

mongoose.connect(DB).then(()=>console.log("database connected")).catch((error)=>console.log("error",error))