const express = require('express');
const { addOrder, acceptOrder, rejectOrder, deliveredOrder, getOrderByHotel, getOrderByUser } = require('./../controllers/orders')

const router = express.Router();

router.post('/addOrder', addOrder);
router.post('/acceptOrder', acceptOrder);
router.post('/rejectOrder', rejectOrder);
router.post('/deliveredOrder', deliveredOrder);
router.post('/getOrderByUser', getOrderByUser);
router.post('/getOrderByHotel', getOrderByHotel);

module.exports = router;