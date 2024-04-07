const mongoose = require('mongoose')
const brcypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    address: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    mobilenumber: {
        type: String,
        required: false,
    },
    hashPassword: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    hotelStatus: {
        type: String,
        required: false,
    },
    minimumAmount: {
        type: Number,
        default: 0,
        required: false,
    }
}, { timestaps: true })

userSchema.methods = {
    authenticate: async function (password) {
        return await brcypt.compare(password, this.hashPassword);
    }
};

const user = mongoose.model('User', userSchema);
module.exports = user;