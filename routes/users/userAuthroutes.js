const express = require("express");
const router = new express.Router();
const userAuthController = require("../../controllers/users/userControllers");
const userUpload = require("../../multerConfig/userConfig/userConfig");


// user auth routes
router.post("/register",userUpload.single("userprofile"),userAuthController.register);
router.post("/login",userAuthController.Login);



module.exports = router;