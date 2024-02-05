const jwt = require('jsonwebtoken');
require('dotenv').config();

// auth
exports.auth = async (req, res, next) => {
    try {
        const token =
            // req.cookies.token
            // || req.body.token
            req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No auth token, access denied",
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                msg: "Token verification failed, authorization denied.",
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// isUser
exports.isUser = async (req, res, next) => {
    try {
        if (req.user.type !== "User") {
            return res.status(401).json({
                success: false,
                msg: "This is protected route for users only",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "User role can't be verified, please try again.",
        });
    }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.type !== "Admin") {
            return res.status(401).json({
                success: false,
                msg: "This is protected route for admin only",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "User role can't be verified, please try again.",
        });
    }
};
