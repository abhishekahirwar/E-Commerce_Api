const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true,
        },
        ratings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Rating",
            },
        ],
    }
);

module.exports = mongoose.model('Product', productSchema);