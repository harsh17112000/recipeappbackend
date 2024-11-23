const express = require("express");
const router = new express.Router();
const recipeUpload = require("../../multerConfig/recipeCOnfig/recipeConfig");
const recipeAuthController = require("../../controllers/recipes/recipesCotnrollers");
const userAuthentication = require("../../middleware/userAuthenticate");


// recipe auth routess
router.post("/create",userAuthentication,recipeUpload.single("recipeImg"),recipeAuthController.createRecipe);
router.patch("/updaterecipe/:recipeid",userAuthentication,recipeUpload.single("recipeImg"),recipeAuthController.updateRecipeData)
router.delete("/deleterecipe/:recipeid",userAuthentication,recipeAuthController.deleteRecipeData);

router.get("/singleRecipe/:recipeid",recipeAuthController.getSingleRecipeData);
router.get("/recipeData",recipeAuthController.getRecipeData);

module.exports = router;