const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (value) => {
                    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    return value.match(re);
                },
                message: 'Please enter a valid email address',
            },
        },
        password: {
            type: String,
            required: true,
            // password validate krna hai...
        },
        address: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
        cart: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
            },
        ],
    }
);

module.exports = mongoose.model('User', userSchema);