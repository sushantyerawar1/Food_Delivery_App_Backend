const express = require('express');
const { contactUs } = require('./../controllers/contact')

const router = express.Router();

router.post('/contact-us', contactUs);


module.exports = router;