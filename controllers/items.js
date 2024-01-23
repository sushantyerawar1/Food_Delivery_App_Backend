const Items = require('../models/items')

exports.addItem = async (req, res) => {
    const { name, hotelId, price, imageLink, quantity, availabilityStatus, description } = req.body;

    console.log(name, hotelId)

    const rating = 0;
    const reviews = [];

    try {

        const item = await Items.create({ name, hotelId, price, imageLink, quantity, availabilityStatus, description, rating, reviews });
        return res.status(201).json({ msg: "Item Added Successfully", Item: { _id: item._id, }, });

    }
    catch {
        return res.status(400).json({ msg: "Unable to Add Item" });
    }
};

exports.getItems = async (req, res) => {

    // const { itemId } = req.params;
    try {
        const items = await Items.find();
        return res.status(201).json({
            "msg": "Items sent",
            "items": items
        })
    }
    catch (error) {
        return res.status(400).json({ error: error });
    }
};

exports.deleteItem = async (req, res) => {
    const itemId = req.body.itemId;
    console.log(itemId, "itemid")
    try {
        const item = await Items.findOneAndDelete({ _id: itemId });
        return res.status(200).json({
            msg: "Item Deleted Successfully",

        });
    } catch (err) {
        return res.status(400).json({ msg: "Unable to Delete Item" });
    }
};

exports.updateItem = async (req, res) => {

    const {
        _id,
        name,
        hotelId,
        price,
        imageLink,
        quantity,
        availabilityStatus,
        description,
    } = req.body;

    try {
        const item = await Items.findOne({ _id: _id });
        if (!item) {
            return res.status(400).json({ msg: "Item not found" });
        }
        else {
            const UpdatedItem = await Items.findByIdAndUpdate({ _id: _id }, {
                name,
                hotelId,
                price,
                imageLink,
                quantity,
                availabilityStatus,
                description
            });
            // console.log('OrderUpdated', UpdatedItem);
            return res.status(200).json({ msg: "Item Updated Successfully" });
        }
    } catch (err) {
        return res.status(400).json({ err: err, msg: "Unable to Update Item" });
    }
};