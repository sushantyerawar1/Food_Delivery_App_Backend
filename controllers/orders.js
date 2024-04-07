const Orders = require('../models/orders')
const nodemailer = require("nodemailer");



const SendMailonOrder = async (email, subject, message) => {

    try {

        var transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sendermail169@gmail.com',
                pass: 'djlhryfqbkxezfgh'
            }
        });

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: subject,
            text: message
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return true;

    }
    catch (error) {

    }

};

exports.addOrder = async (req, res) => {
    const { userId, hotelId, cartItems, hotelName, userName, amount, email, hotelemailid, userMobileNumber, hotelMobileNumber, address } = req.body;
    const orderAcceptOrDecline = "NULL";
    const orderStatus = "Pending";
    // console.log(userMobileNumber, hotelMobileNumber, "hotelemid")
    const order = await Orders.create({
        userId,
        hotelId,
        hotelName,
        userName,
        cartItems,
        orderAcceptOrDecline,
        orderStatus,
        amount,
        email,
        userMobileNumber,
        hotelMobileNumber,
        address
    });


    if (order) {

        if (SendMailonOrder(email, "Order Placed", "Thanks for Ordering. Your Order Placed Successfully!") && SendMailonOrder(hotelemailid, "New Order", "You Have New Order!. Please Accept it.")) {
            // console.log("Sent Mail");
            return res.status(201).json({
                msg: "Order Placed Successfully",
                order: {
                    _id: order._id,
                },
            });
        }
    }
    else {
        return res.status(400).json({ msg: "Unable to Accept Order" });
    }
}

exports.acceptOrder = async (req, res) => {
    const { orderId, email } = req.body;
    try {
        const order = await Orders.findOne({ _id: orderId });
        if (!order) {
            return res.status(400).json({ msg: "Order not found" });
        }
        else {
            const UpdatedOrder = await Orders.findByIdAndUpdate({ _id: orderId }, {
                orderAcceptOrDecline: "Accepted",
                orderStatus: "Processed",
            });

            if (SendMailonOrder(email, "Order Accepted", "Your Order has been accepted.")) {
                return res.status(200).json({ msg: "Order Accepted Successfully" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something wrong" });
    }

}

exports.rejectOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Orders.findOne({ _id: orderId });
        if (!order) {
            return res.status(400).json({ msg: "Order not found" });
        }
        else {
            const UpdatedOrder = await Orders.findByIdAndUpdate({ _id: orderId }, {
                orderAcceptOrDecline: "Rejected",
                orderStatus: "Rejected"
            });
            if (SendMailonOrder(email, "Order Rejected", "Your Order has been Rejected.")) {
                return res.status(200).json({ msg: "Order Rejected Successfully" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something wrong" });
    }
}

exports.deliveredOrder = async (req, res) => {
    const { orderId, email } = req.body;
    try {
        const order = await Orders.findOne({ _id: orderId });
        if (!order) {
            return res.status(400).json({ msg: "Order not found" });
        }
        else {
            const UpdatedOrder = await Orders.findByIdAndUpdate({ _id: orderId }, {
                orderStatus: "Delivered",
            });
            if (SendMailonOrder(email, "Order Delivered", "Your Order has been Delivered.")) {
                return res.status(200).json({ msg: "Order Delivered Successfully" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something wrong" });
    }
}

exports.getOrderByUser = async (req, res) => {
    const { userId } = req.body
    try {
        const userOrders = await Orders.find({ userId: userId });
        // console.log(userOrders, "userorders")
        if (!userOrders) {
            return res.status(400).json({ msg: "No such user exists" });
        }
        else {
            return res.status(201).json({ msg: "Orders fetched successfully", userOrders: userOrders });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something went wrong", err: error });
    }
}

exports.getOrderByHotel = async (req, res) => {
    const { hotelId } = req.body
    try {
        const hotelOrders = await Orders.find({ hotelId: hotelId });
        if (!hotelOrders) {
            return res.status(400).json({ msg: "No such user exists" });
        }
        else {
            return res.status(201).json({ msg: "Orders fetched successfully", hotelOrders: hotelOrders });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something went wrong", err: error });
    }
}