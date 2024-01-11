const express = require('express');
const router = express.Router();
const cartOrder = require('../controllers/cartOrderController');
const { auth } = require('../middlewares/auth');



router.route('/cart/add').post(auth, cartOrder.addToCart);
router.route('/cart/remove').post(auth, cartOrder.removeToCart);
router.route('/cart/:id').get(auth, cartOrder.getCart);
router.route('/cart/:id').delete(auth, cartOrder.deleteCart);
router.route('/cart/erase').post(auth, cartOrder.removeFromCart);

module.exports = router;