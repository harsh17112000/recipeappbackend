const userDB = require("../../models/users/userModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../Cloudinary/cloudinary");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const { transporter } = require("../../helper");


// user register
exports.register = async (req, res) => {
    const file = req.file ? req.file.path : "";
    const { username, email, password, confirmpassword } = req.body;

    if (!username || !email || !password || !confirmpassword || !file) {
        res.status(400).json({ error: "all field are required" });
    }

    const upload = await cloudinary.uploader.upload(file);

    try {
        const preuser = await userDB.findOne({ email: email });

        if (preuser) {
            res.status(400).json({ error: "this user is already exist" });
        } else if (password !== confirmpassword) {
            res.status(400).json({ error: "password and confirm password not match" });
        } else {
            // password hash
            const haspassword = await bcrypt.hash(password, 12);

            const userData = new userDB({
                username, email, password: haspassword, userprofile: upload.secure_url
            });

            await userData.save();
            res.status(200).json(userData)
        }
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({ error: error })
    }

}

// user Login
exports.Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "all field are required" });
    }

    try {
        const userValid = await userDB.findOne({ email: email });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(400).json({ error: "invalid details" });
            } else {
                // token generate
                const token = await userValid.generateAuthtoken();

                const result = {
                    token
                }
                res.status(200).json({ result, message: "user sucessfully logged in" })
            }
        } else {
            res.status(400).json({ error: "this user is not exist in db" });
        }
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({ error: error })
    }
}

// userVerify
exports.userVerify = async (req, res) => {
    try {
        const verifyUser = await userDB.findOne({ _id: req.userId });
        res.status(200).json(verifyUser);
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({ error: error })
    }
}

// fotgotpassword
exports.fotgotpassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "enter your email" })
    }

    try {
        const userFind = await userDB.findOne({ email: email });
        if (!userFind) {
            res.status(400).json({ error: "this user is not exist in db" })
        } else {

            // token generate for reset password
            const token = jwt.sign({ _id: userFind._id }, SECRET_KEY, {
                expiresIn: "120s"
            });

            const setuserToken = await userDB.findByIdAndUpdate({ _id: userFind._id }, { verifytoken: token }, { new: true });
           

            if (setuserToken) {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For password Reset",
                    html: `
                    <h2>Password Reset Request</h2>
            <p>Hi ${userFind.username},</p>
            <p>You requested to reset your password. Please click on the link below to reset your password:</p>
            <a href="http://localhost:3001/resetpassword/${userFind.id}/${setuserToken.verifytoken}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Your Company Name</p>
                    `
                }

                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        console.log("error",error);
                        res.status(400).json({error:"email not send"})
                    }else{
                        console.log("Emial sent",info.response);
                        res.status(200).json({message:"Email Sent sucessfully"})
                    }
                })
            } else {
                res.status(400).json({ error: "user invalid" })
            }
        }
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({ error: error })
    }
}

// forgotpasswordVerify
exports.forgotpasswordVerify = async(req,res)=>{
    const {id,token} = req.params;

    try {
        const validUser = await userDB.findOne({_id:id,verifytoken:token});

        const verifyToken = jwt.verify(token,SECRET_KEY);

        if(validUser && verifyToken._id){
            res.status(200).json({message:"Valid user"})
        }else{
            res.status(400).json({error:"link expire"})
        }
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({ error: error })
    }
}

// resetPassword
exports.resetPassword = async(req,res)=>{
    const {id,token} = req.params;
    const {password} = req.body;

    try {
        const validUser = await userDB.findOne({_id:id,verifytoken:token});

        const verifyToken = jwt.verify(token,SECRET_KEY);

        if(validUser && verifyToken._id){
            const newpassword = await bcrypt.hash(password,12);

            const setUsernewPassword = await userDB.findByIdAndUpdate({_id:id},{password:newpassword},{new:true});

            res.status(200).json({message:"password sucessfully updated",setUsernewPassword})
        }else{
            res.status(400).json({error:"link expire"})
        }
    } catch (error) {
        console.log("catch block error", error)
        res.status(500).json({ error: error })
    }
}