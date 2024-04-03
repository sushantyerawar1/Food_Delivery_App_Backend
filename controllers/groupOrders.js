const catchAsyncError = require('../middlewares/catchAsyncError');
const Groups = require('../models/groupOrders');
const ErrorHandler = require('../utils/errorhandler');
const { getItem, getCart } = require("./../services/groupCartOrder");
const Cart = require("../models/cartOrders");
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


exports.createGroup = async (req, res) => {
    const { hotelId, userName, userId, groupId, groupName, hotelName, email } = req.body;
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
            hotelName,
            email,
            cartItems: new Map(),
        });

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

exports.fetchGroup = async (req, res) => {
    const { groupId } = req.body;
    const group = await Groups.findOne({ groupId: groupId });
    if (!group) {
        return res.status(400).json({ msg: "Group Not Found" })
    }
    try {
        const cart = group.cartItems;
        const admin = group.adminId;
        var temp = [];
        var indv = [];
        var total = 0;
        // console.log()
        cart.forEach((ele) => {
            var indvtotal = 0;
            var t = [...ele];
            // console.log();
            t[0].items.forEach((item) => {
                indvtotal += item.price * item.quantity;
            });

            total += indvtotal;
            // console.log("here", t[0].indvtotal)
            temp.push(t[0]);
            indv.push(indvtotal);
        });
        // console.log(temp);

        return res.status(201).json({ msg: "Cart Fetched Successfully", cart: temp, adminId: admin, total: total, indvtotal: indv });
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
    const userIndex = await group.userIds.findIndex(ele => ele === userId);
    // console.log(userIndex);
    if (userIndex === -1) {
        return next(new ErrorHandler("User not found", 404));
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
    const { groupId, email, hotelemailid } = req.body;
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
            if (SendMailonOrder(email, "Order Placed", "Thanks for Ordering. Your Order Placed Successfully!")
                && SendMailonOrder(hotelemailid, "New Order", "You Have New Order!. Please Accept it.")) {
                res.status(200).send({ success: true, message: "Order Placed successfully" });
            }
        }
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Order could not be placed", error: err, });
    }
}


exports.acceptGroupOrder = async (req, res) => {
    const { groupId, email } = req.body;
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
            if (SendMailonOrder(email, "Order Accepted", "Your Order has been accepted.")) {
                return res.status(200).json({ msg: "Order Accepted Successfully" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Order could not be accepted" });
    }

}


exports.rejectGroupOrder = async (req, res) => {
    const { groupId, email } = req.body;
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
            if (SendMailonOrder(email, "Order Rejected", "Your Order has been Rejected.")) {
                return res.status(200).json({ msg: "Order Rejected Successfully" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Order could not be rejected" });
    }

}

exports.deliverGroupOrder = async (req, res) => {
    const { groupId, email } = req.body;
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
            if (SendMailonOrder(email, "Order Delivered", "Your Order has been Delivered.")) {
                return res.status(200).json({ msg: "Order Delivered Successfully" });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Order could not be delivered" });
    }

}



exports.getGroupOrderByUser = async (req, res) => {
    const { userId } = req.body
    try {
        const userGroups = await Groups.find({ userIds: userId });
        if (!userGroups) {
            return res.status(400).json({ msg: "No such user exists" });
        }
        else {
            return res.status(201).json({ msg: "Orders fetched successfully", userGroups: userGroups });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something went wrong", err: error });
    }
}

exports.getGroupOrderByHotel = async (req, res) => {

    const { hotelId } = req.body
    try {
        const hotelGroupOrders = await Groups.find({ hotelId: hotelId });
        // console.log(hotelGroupOrders, "heheheh")

        if (!hotelGroupOrders) {
            return res.status(400).json({ msg: "No such user exists" });
        }
        else {
            let orders = [];
            hotelGroupOrders.forEach(group => {
                // console.log(group, "groupppppppppppppppp")
                if (group.hotelId === hotelId && group.orderStatus !== "ORDER_PENDING") {


                    const userId = group.adminId;
                    const groupName = group.groupName
                    const groupId = group.groupId
                    const email = group.email
                    // consoile.log(email, "emailllllllllll")
                    let amount = 0;
                    let items = new Map();
                    group.cartItems.forEach((key, value) => {
                        key[0].items.forEach(item => {
                            let currItem = {
                                name: item.name,
                                price: item.price,
                                quantity: item.quantity,
                                itemID: item.itemID,
                                imageLink: item.imageLink
                            }
                            if (items.has(item.itemID)) {
                                currItem.quantity += items.get(item.itemID).quantity
                            }
                            items.set(item.itemID, currItem)
                            amount += item.price * item.quantity;
                        })
                    })

                    let finalitems = [];
                    items.forEach(item => {
                        let temp = JSON.parse(JSON.stringify(item));
                        finalitems.push(temp);
                    })


                    let order = {
                        groupName: groupName,
                        userId: userId,
                        amount: amount,
                        items: finalitems,
                        orderStatus: group.orderStatus,
                        groupId: groupId,
                        email: email
                    }
                    orders.push(order)

                }
            })
            // console.log(orders, "orders")
            return res.status(201).json({ msg: "Orders fetched successfully", hotelOrders: orders });
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "Something went wrong", err: error });
    }
}
