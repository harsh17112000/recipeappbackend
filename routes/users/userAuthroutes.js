const express = require("express");
const router = new express.Router();
const userAuthController = require("../../controllers/users/userControllers");
const userUpload = require("../../multerConfig/userConfig/userConfig");
const userAuthenticate = require("../../middleware/userAuthenticate");


// user auth routes
router.post("/register",userUpload.single("userprofile"),userAuthController.register);
router.post("/login",userAuthController.Login);
router.post("/forgotpassword",userAuthController.fotgotpassword);
router.get("/forgotpassword/:id/:token",userAuthController.forgotpasswordVerify);
router.put("/resetpassword/:id/:token",userAuthController.resetPassword);

// user verify api
router.get("/userloggedin",userAuthenticate,userAuthController.userVerify);



module.exports = router;