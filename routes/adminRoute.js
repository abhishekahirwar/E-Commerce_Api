const express = require('express');
const router = express.Router();

// middleware
const { auth, isAdmin } = require('../middleware/auth');

// Admin Routes
const { addProduct, getAllProduct, deleteProduct, getAllOrders, changeOrderStatus, analytics } = require('../controllers/adminController');
router.post('/add-product', auth, isAdmin, addProduct);
router.get('/get-products', auth, isAdmin, getAllProduct);
router.delete('/delete-product', auth, isAdmin, deleteProduct);
router.get("/get-orders", auth, isAdmin, getAllOrders);
router.post("/change-order-status", auth, isAdmin, changeOrderStatus);
router.get("/analytics", auth, isAdmin, analytics);

module.exports = router;