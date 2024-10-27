const userDB = require("../../models/users/userModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../Cloudinary/cloudinary");


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