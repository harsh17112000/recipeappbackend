const express = require("express");
const router = new express.Router();
const userAuthentication = require("../../middleware/userAuthenticate");
const reviewAuthController = require("../../controllers/reviews/reviewControllers");


// review auth
router.post("/create/:recipeid",userAuthentication,reviewAuthController.createReview);
router.get("/getreview/:recipeid",reviewAuthController.getRecipeReview);
router.delete("/deletereview/:reviewid",userAuthentication,reviewAuthController.deleteReview);


module.exports = router;