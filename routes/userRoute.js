const express = require('express');
const router = express.Router();

// signUp route
const { signUp, signIn, tokenIsValid, getUserData } = require('../controllers/authController');
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/tokenIsValid', tokenIsValid);

// middlewares
const { auth, isUser } = require('../middleware/auth');

// get user's data
router.get('/', auth, getUserData);

// user
const { addToCart, removeFromCart, saveUserAddress, orderProduct, myOrders } = require('../controllers/userController');
router.post('/add-to-cart', auth, isUser, addToCart);
router.delete("/remove-from-cart/:id", auth, isUser, removeFromCart);
router.post('/save-user-address', auth, isUser, saveUserAddress);
router.post("/orderProduct", auth, isUser, orderProduct);
router.get("/orders/me", auth, isUser, myOrders);

// Product
const { getProductsCategoryWise, getSearchProductByName, rateProducts, dealOfDay } = require('../controllers/productController');
router.get('/getProductCategoryWise/:category', auth, isUser, getProductsCategoryWise);
router.get("/products/search/:name", auth, isUser, getSearchProductByName);
router.post("/rate-product", auth, isUser, rateProducts);
router.get("/deal-of-day", auth, isUser, dealOfDay);

module.exports = router;