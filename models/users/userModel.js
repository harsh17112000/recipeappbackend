const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    userprofile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],

    // for forgot password
    verifytoken:{
        type:String,
    }
},{timestamps:true});

// token generate
userSchema.methods.generateAuthtoken = async function(){
    try {
        let newToken = jwt.sign({_id:this._id},SECRET_KEY,{
            expiresIn:"1d"
        });

        this.tokens = this.tokens.concat({token:newToken});
        await this.save()
        return newToken
    } catch (error) {
        res.status(400).json({error:error})
    }
}

// model
const userDB = new mongoose.model("users",userSchema);
module.exports = userDB;