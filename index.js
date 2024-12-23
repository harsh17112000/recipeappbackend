require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const port = 5002;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json("server start");
});

// user routes
const userAuthRoutes = require("./routes/users/userAuthroutes");
app.use("/userauth/api",userAuthRoutes);


// recipe routes
const reciperoutes = require("./routes/recipes/recipeAuthRoutes");
app.use("/recipe/api",reciperoutes);

// review routes
const reviewroutes = require("./routes/reviews/reviewAuthRoutes");
app.use("/review/api",reviewroutes);

// server start
app.listen(port,()=>{
    console.log(`server start at port no ${port}`)
})