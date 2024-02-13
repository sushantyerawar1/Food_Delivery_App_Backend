const catchAsyncError = require('../middlewares/catchAsyncError');
const Groups = require('../models/groupOrders');
const ErrorHandler = require('../utils/errorhandler');
const { getItem, getCart } = require("./../services/groupCartOrder");
const Cart = require("../models/cartOrders");
exports.createGroup = async (req, res) => {
    const { hotelId, userName, userId, groupId, groupName } = req.body;
    const userIds = [userId];
    const adminId = userId;
    const cartItemsForUser = [];

    try {
        const group = await Groups.create({
            adminId,
            hotelId,
            groupId,
            groupName,
            userIds,
            // orderStatus,
            cartItems: new Map(),
        });

        // group.orderStatus.set("ORDER_PENDING")
        group.cartItems.set(userId, { userId, userName, items: cartItemsForUser });

        await group.save();

        return res.status(201).json({ msg: "Group Created Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}



exports.joinGroup = async (req, res) => {
    const { userName, userId, groupId } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    if (!group) {
        return res.status(400).json({ msg: "Group Not Found" })
    }
    try {
        group.userIds.push(userId)
        const cartItemsForUser = [];

        group.cartItems.set(userId, { userId, userName, items: cartItemsForUser });

        await group.save();

        return res.status(201).json({ msg: "User Added Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error });
    }
};

exports.addItem = catchAsyncError(async (req, res, next) => {
    const { groupId, userId, userName, item } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    // console.log(group , item); 
    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }
    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
    }
    try {
        await group.addItem(userId, userName, item);
        // await group.save() ; 

        res.status(200).send({
            success: true,
            message: "item added successfully",
        });


    }
    catch (err) {
        res.status(500).send({
            message: err,
            success: false,
        })
    }
})

exports.removeItem = catchAsyncError(async (req, res, next) => {
    const { groupId, item, userId, userName } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }
    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
    }

    try {
        await group.removeItem(userId, userName, item);
        res.status(200).send({ success: true, message: "Item removed successfully" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Error removing item" });
    }
});

exports.deleteItem = catchAsyncError(async (req, res, next) => {
    const { groupId, item, userId, userName } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }
    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
    }

    try {
        await group.deleteItem(userId, userName, item);
        res.status(200).send({ success: true, message: "Item deleted successfully" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Error deleting item" });
    }
});




exports.deleteCart = catchAsyncError(async (req, res, next) => {
    const { groupId, userId, userName } = req.body;
    const group = await Groups.findOne({ groupId: groupId });

    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
    }

    try {
        await group.deleteCart(userId, userName);
        res.status(200).send({ success: true, message: "Cart deleted successfully" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Error deleting Cart", error: err });
    }
});


exports.addCartToGroup = catchAsyncError(async (req, res, next) => {
    const { groupId, cartId, userId, userName } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    const cart = await Cart.findOne({ _id: cartId });


    if (!cart) {
        return next(new ErrorHandler("cart not found", 404));
    }
    if (!group) {
        return next(new ErrorHandler("Group not found", 404));
    }
    //  console.log(group);

    try {
        await group.addCartToGroup(cart, userId, userName);
        //  console.log(group); 
        res.status(200).send({ success: true, message: "Cart Added successfully" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Error Adding Cart to Group", error: err, });
    }
});


exports.placeGroupOrder = async (req, res) => {
    const { groupId } = req.body;
    try {
        const group = await Groups.findOne({ groupId: groupId });
        if (!group) {
            return res.status(400).json({ msg: "Group not found" });
        }
        else {
            await Groups.findOneAndUpdate(
                {
                    groupId: groupId
                },
                {
                    $set: { "orderStatus": "ORDER_PLACED" },
                }
            );
            res.status(200).send({ success: true, message: "Order Placed successfully" });
        }
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Order could not be placed", error: err, });
    }
}


exports.acceptGroupOrder = async (req, res) => {
    const { groupId } = req.body;
    try {
        const group = await Groups.findOne({ groupId: groupId });
        if (!group) {
            return res.status(400).json({ msg: "Group not found" });
        }
        else {
            await Groups.findOneAndUpdate(
                {
                    groupId: groupId
                },
                {
                    orderStatus: "ORDER_ACCEPTED",
                }
            );

            return res.status(200).json({ msg: "Order Accepted Successfully" });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Order could not be accepted" });
    }

}


exports.rejectGroupOrder = async (req, res) => {
    const { groupId } = req.body;
    try {
        const group = await Groups.findOne({ groupId: groupId });
        if (!group) {
            return res.status(400).json({ msg: "Group not found" });
        }
        else {
            await Groups.findOneAndUpdate(
                {
                    groupId: groupId
                },
                {
                    orderStatus: "ORDER_REJECTED",
                }
            );

            return res.status(200).json({ msg: "Order Rejected Successfully" });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Order could not be rejected" });
    }

}

exports.deliverGroupOrder = async (req, res) => {
    const { groupId } = req.body;
    try {
        const group = await Groups.findOne({ groupId: groupId });
        if (!group) {
            return res.status(400).json({ msg: "Group not found" });
        }
        else {
            await Groups.findOneAndUpdate(
                {
                    groupId: groupId
                },
                {
                    orderStatus: "ORDER_DELIVERED",
                }
            );

            return res.status(200).json({ msg: "Order Delivered Successfully" });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Order could not be delivered" });
    }

}



exports.getGroupOrderByUser = async (req, res) => {
    const { userId } = req.body
    try {
        const userOrders = await Orders.find({ userId: userId });
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
