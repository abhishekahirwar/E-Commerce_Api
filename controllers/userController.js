const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

// add to cart product Controller
exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "User Not Found.",
            });
        }

        if (user.cart.length == 0) {
            user.cart.push(product);
        } else {
            let isProductFound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i]._id.equals(product._id)) {
                    isProductFound = true;
                }
            }

            if (isProductFound) {
                return res.status(404).json({
                    success: false,
                    msg: "This Product is already added in cart.",
                });
            }
            else {
                user.cart.push(product);
            }
        }

        user = await user.save();

        return res.status(201).json({
            success: true,
            user,
            msg: "Product Successfully Added.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// product remove from cart Controller
exports.removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { cart: productId } },
            { new: true },
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "User Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            user,
            msg: "Product Successfully Remove.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// save user address
exports.saveUserAddress = async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { address: address } },
            { new: true },
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "User Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            user,
            msg: "Address Successfully Saved.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// order product Controller
exports.orderProduct = async (req, res) => {
    try {
        const { productId, address } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(401).json({
                success: false,
                msg: "Product Not Found!",
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User Not Found!",
            });
        }

        const order = await Order.create({
            userId: req.user.id,
            products: productId,
            address: address,
            price: product.price,
        });

        return res.status(201).json({
            success: true,
            order,
            msg: "Product ordered Successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// my orders Controllers
exports.myOrders = async (req, res) => {
    try {
        const order = await Order.findOne({ userId: req.user.id })
            .populate({
                path: 'userId',
                select: 'name',
            })
            .populate({
                path: 'products',
                select: 'name ratings',
                populate: {
                    path: 'ratings',
                    model: 'Rating',
                    // select: 'rating',
                }
            });

        if (!order) {
            return res.status(401).json({
                success: false,
                msg: "Order Not Found!",
            });
        }

        return res.status(200).json({
            success: true,
            order,
            msg: "Order Fetch Successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};