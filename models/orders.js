const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        // ref: 'User',
        required: true
    },
    hotelId: {
        type: String,
        // ref: 'User',
        required: true,
    },
    hotelName: {
        type: String,
        // ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        // ref: 'User',
        required: true,
    },
    userMobileNumber: {
        type: Number,
        // ref: 'User',
        required: true,
    },
    hotelMobileNumber: {
        type: Number,
        // ref: 'User',
        required: true,
    },
    email: {
        type: String,
        // ref: 'User',
        required: true,
    },
    address: {
        type: String,
        // ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        // ref: 'User',
        required: true,
    },
    cartItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
            itemID: {
                type: String,
                // ref: "Item",
                required: true,
            }
        }
    ],
    orderAcceptOrDecline: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Orders', orderSchema); 