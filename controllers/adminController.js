const Product = require('../models/product');
const Order = require('../models/order');
const product = require('../models/product');
const cloudinary = require("cloudinary").v2;

//  imageupload -> handler function
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Add Product Controller
exports.addProduct = async (req, res) => {
    try {
        const { name, description, quantity, price, category } = req.body;

        const { imageFile } = req.files;

        // Validate file type
        const supportedTypes = ['jpg', 'jpeg', 'png'];
        const fileType = imageFile.name.split('.')[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File format not supported',
            });
        }

        // File format supported, upload to Cloudinary
        const response = await uploadFileToCloudinary(imageFile, 'FileUpload');
        const imageURL = response.secure_url;

        let product = new Product({
            name,
            description,
            images: [imageURL],
            quantity,
            price,
            category,
        });

        product = await product.save();

        return res.status(201).json({
            success: true,
            product,
            msg: "Product Created Successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// Get all your products Controller
exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find({});

        if (!products) {
            return res.status(401).json({
                success: false,
                msg: "Product Not Found.",
            });
        }

        return res.status(200).json({
            success: true,
            products,
            msg: "All Product Fetched Successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// Delete the product  Controller
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(401).json({
                success: false,
                msg: "Product not found!",
            });
        }

        return res.status(200).json({
            success: true,
            product,
            msg: "Product Deleted Successfully.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// getAllOrders
exports.getAllOrders = async (req, res) => {
    try {
        const order = await Order.find()
            .populate({ path: 'userId', select: 'name', })
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
                msg: "No Order Are Places",
            });
        }

        return res.status(200).json({
            success: true,
            order,
            msg: "All orders are fetched successfully.",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// change order status Controller
exports.changeOrderStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const order = await Order.findOneAndUpdate(
            { userId: id },
            { $set: { status: status } },
            { new: true },
        );

        if (!order) {
            return res.status(401).json({
                success: false,
                msg: "No Order Are Places",
            });
        }

        return res.status(200).json({
            success: true,
            order,
            msg: "Order status change successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

// analytics Controller for Admin
exports.analytics = async (req, res) => {
    try {
        const orders = await Order.find({});

        if (!orders) {
            return res.status(401).json({
                success: false,
                msg: "No Order Are Places",
            });
        }

        let totalEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            totalEarnings += orders[i].price;
        }

        // CATEGORY WISE ORDER FETCHING
        let mobileEarnings = await fetchCategoryWiseProduct("Mobile");
        let essentialEarnings = await fetchCategoryWiseProduct("Essential");
        let applianceEarnings = await fetchCategoryWiseProduct("Appliance");
        let booksEarnings = await fetchCategoryWiseProduct("Book");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

        let earnings = {
            totalEarnings,
            mobileEarnings,
            essentialEarnings,
            applianceEarnings,
            booksEarnings,
            fashionEarnings,
        };

        return res.status(200).json({
            success: true,
            earnings,
            msg: "Analytics of Order.",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error.",
        });
    }
};

async function fetchCategoryWiseProduct(category) {
    let earnings = 0;
    const order = await Order.find();

    for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < order[i].products.length; j++) {
            const product = await Product.findById(order[i].products[j]);
            const cate = product.category;
            if (cate === category) {
                earnings += product.price;
            }
        }
    }
    return earnings;
};