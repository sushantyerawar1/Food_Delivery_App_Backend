const express = require('express');
const { addOrder, acceptOrder, rejectOrder, deliveredOrder } = require('./../controllers/orders')

const router = express.Router();

router.post('/addOrder', addOrder);
router.post('/acceptOrder', acceptOrder);
router.post('/rejectOrder', rejectOrder);
router.post('/deliveredOrder', deliveredOrder);

module.exports = router;