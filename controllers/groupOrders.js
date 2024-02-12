const Groups = require('../models/groupOrders')

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
    if (!group){
        return res.status(400).json({msg : "Group Not Found"})
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
}