const express = require('express');
const { addItem, getItems, deleteItem, updateItem } = require('./../controllers/items')

const router = express.Router();

router.post('/additem', addItem);
router.get('/getitems', getItems);
router.post('/deleteitem', deleteItem);
router.post('/updateitem', updateItem);

module.exports = router;