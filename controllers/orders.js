const Orders = require('../models/orders')

exports.addOrder = async (req, res) => {
    const { userId, hotelId, cartItems } = req.body;
    const orderAcceptOrDecline = "NULL";
    const orderStatus = "NULL";
    const order = await Orders.create({
        userId,
        hotelId,
        cartItems,
        orderAcceptOrDecline,
        orderStatus,
    });

    if (order) {
        return res.status(201).json({
            msg: "Order Placed Successfully",
            order: {
                _id: order._id,
            },
        });
    }
    else {
        return res.status(400).json({ msg: "Unable to Accept Order" });
    }
}

exports.acceptOrder = async (req, res) => {
    const { orderId } = req.body;
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
            // console.log('OrderUpdated', UpdatedOrder);
            return res.status(200).json({ msg: "Order Accepted Successfully" });
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
            });
            // console.log('OrderUpdated', UpdatdO/rder);
            return res.status(200).json({ msg: "Order Rejected Successfully" });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something wrong" });
    }
}

exports.deliveredOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Orders.findOne({ _id: orderId });
        if (!order) {
            return res.status(400).json({ msg: "Order not found" });
        }
        else {
            const UpdatedOrder = await Orders.findByIdAndUpdate({ _id: orderId }, {
                orderStatus: "Delivered",
            });

            return res.status(200).json({ msg: "Order Delivered Successfully" });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something wrong" });
    }
}