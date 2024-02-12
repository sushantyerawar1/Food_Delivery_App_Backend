const express = require('express');
const { createGroup, joinGroup } = require('./../controllers/groupOrders')

const router = express.Router();

router.post('/createGroup', createGroup);
router.post('/joinGroup', joinGroup);


module.exports = router;