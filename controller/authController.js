const userModel = require("../model/userSchema.js");
const emailValidator = require('email-validator');
const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: "false",
            message: "Every field is required"
        });
    }

    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: "false",
            message: "Please provide a valid email id."
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: "false",
            message: "Password and confirm password doesnot match."
        });
    }

    try {
        const userInfo = userModel(req.body);

        const result = await userInfo.save();
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({
                success: true,
                message: "Account already exists with provided email id"
            });
        }
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: "false",
            message: "Every field is required"
        });
    }
    try {
        const user = await userModel
            .findOne({
                email
            })
            .select('+password');
    
        if (!user || user.password !== password) {
            return res.status(400).json({
                success: "false",
                message: "Invalid Credentials"
            });
        }
        const token = user.jwtToken();
        user.password = undefined;
    
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
    
        } 
    
        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        }) 
    } catch (e) {
        return res.status(400).json({
            success: "false",
            message: "e.message"
        });
    }
    

}

const getuser = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (e) {
        return res.status(200).json({
            success: false,
            data: e.message
        });
    }
}

module.exports = {
    signup,
    signin,
    getuser
}

// Start from : 17:13