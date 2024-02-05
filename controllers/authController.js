const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// signUp Controller
exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                msg: "All Fields are mandatory",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User with same email already exists!",
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 8);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            user,
            msg: "SignUp Successful.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

// signIn Controller
exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                success: false,
                msg: "All Fields are mandatory",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User with this email does not exist!"
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Incorrect password.",
            });
        }

        const token = jwt.sign({ id: user._id, email: user.email, type: user.type }, process.env.JWT_SECRET, { expiresIn: "24h" });

        user.password = undefined;

        return res.status(200).json({
            success: true,
            token,
            user,
            msg: "Sign In Successful.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
};

// token validation
exports.tokenIsValid = async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(400).json({
                success: false,
                msg: "Token not found.",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                success: false,
                msg: "Invalid Token!",
            });
        }

        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "User Not Found.",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "User Found Successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// get user data
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.password = undefined;
        return res.status(200).json({
            success: true,
            ...user._doc,
            // token: req.token,
            msg: "User's data fetched successfully.",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};