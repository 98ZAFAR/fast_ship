const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const { createToken } = require("../utils/validate");

const handleCreateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).json({
            success: false,
            message: "All Fields Are Mandatory!",
        });

        const user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({
            success: false,
            message: "User Already Exists!",
        });

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPass
        });

        return res.status(201).json({
            success: true,
            message: "User Created Successfully!",
            data: { user: newUser }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        })
        console.error(error);
    }
};

const handleLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({
            success: false,
            message: "All Fields Are Mandatory!",
        });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({
            success: false,
            message: "No User Found!",
        });

        const check = await bcrypt.compare(password, user.password);

        if (check) {
            const token = createToken(user);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000
            });
            
            console.log("Token : ",token);
            return res.status(200).json({
                success: true,
                message: "User Logged In Successfully!",
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password Not Matched!",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        })
        console.error(error);
    }
};

module.exports = { handleCreateUser, handleLoginUser };