const express = require('express');
const router = express.Router();
const cartOrder = require('../controllers/cartOrderController');
const { auth } = require('../middlewares/auth');



router.route('/cart/add').post(auth, cartOrder.addToCart);
router.route('/cart/remove').post(auth, cartOrder.removeToCart);
router.route('/cart/hotel/:id').post(auth, cartOrder.getCart);
router.route('/cart/hotel/:id').delete(auth, cartOrder.deleteCart);
router.route('/cart/erase').delete(auth, cartOrder.removeFromCart);

module.exports = router;