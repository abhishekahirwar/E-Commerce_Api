const Product = require('../models/product');
const Rating = require('../models/rating');

// get the products by the category Controller
exports.getProductsCategoryWise = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.findOne({ category: new RegExp(category, 'i') });

        if (!products) {
            return res.status(401).json({
                success: false,
                msg: "Product Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            products,
            msg: "Products Fetched Successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// search products and get them by their name Controller
exports.getSearchProductByName = async (req, res) => {
    try {
        const products = await Product.find({
            name: {
                $regex: req.params.name,
                $options: "i",
            },
        });

        if (!products) {
            return res.status(401).json({
                success: false,
                msg: "Product Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            products,
            msg: "Product Found!",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// rate the product Controller
exports.rateProducts = async (req, res) => {
    try {
        const { productId, rating } = req.body;
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(401).json({
                success: false,
                msg: "Product Not Found.",
            });
        }

        const userRating = await Rating.findOne({ userId: req.user.id, productId });

        if (userRating) {
            userRating.rating = rating;
            await userRating.save();
        } else {
            const rat = await Rating.create({
                userId: req.user.id,
                productId,
                rating,
            });

            product.ratings.push(rat);
            product = await product.save();
        }

        let ratedProduct = await product.populate({ path: 'ratings', select: 'userId productId rating' });

        return res.status(200).json({
            success: true,
            ratedProduct,
            msg: "Product Rated Successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// deal of the day Controller
exports.dealOfDay = async (req, res) => {
    try {
        let products = await Product.find().populate('ratings');

        products = products.sort(async (a, b) => {
            let aSum = await calculateRatingSum(a);
            let bSum = await calculateRatingSum(b);

            return aSum < bSum ? 1 : -1;
        });

        let sortedProduct = products[products.length-1];

        return res.status(200).json({
            success: true,
            sortedProduct,
            msg: "Deal of the day product.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

async function calculateRatingSum(product) {
    let sum = 0;
    for (let i = 0; i < product.ratings.length; i++) {
        const ratingDocument = await Rating.findById(product.ratings[i]);
        sum += ratingDocument ? ratingDocument.rating : 0;
    }
    return sum;
};