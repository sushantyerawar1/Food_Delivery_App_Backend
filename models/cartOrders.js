const mongoose = require('mongoose');

const cartOrderSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        hotelID: {
            type: String,
            ref: "User",
            required: true,
        },
        orderItems: [{
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            itemID: {
                type: String,
                // ref : "Item",
                required: true,
            }
        }],

    }

);


cartOrderSchema.methods.addItem = function (item) {
    // Check if the item already exists in the cart
    // console.log(item)
    const existingItem = this.orderItems.find(orderItem => (orderItem?.itemID == (item?.itemID)) || (orderItem?.itemID == (item?._id)));


    if (existingItem) {
        // If the item exists, update the quantity
        existingItem.quantity += 1;
    } else {
        // If the item doesn't exist, add it to the cart 

        this.orderItems.push({
            name: item.name,
            price: item.price,
            quantity: 1,
            itemID: item._id
        });

    }

    // Save the changes to the cart order
    return this.save();
};

cartOrderSchema.methods.deleteItem = function (itemID) {

    const itemIndex = this.orderItems.findIndex(orderItem => orderItem?.itemID == itemID);

    if (itemIndex !== -1) {
        this.orderItems.splice(itemIndex, 1);
        return this.save();
    }
    return Promise.resolve(this);


}
cartOrderSchema.methods.removeItem = function (item) {
    // Find the index of the item in the orderItems arraym
    // console.log(item)

    const itemIndex = this.orderItems.findIndex(orderItem => (orderItem?.itemID == (item?.itemID)) || (orderItem?.itemID == (item?._id)));

    // console.log(itemIndex);
    if (itemIndex !== -1) {
        // If the item is found, decrease the quantity

        this.orderItems[itemIndex].quantity -= 1;

        // If the quantity becomes zero, remove the item from the cart
        if (this.orderItems[itemIndex].quantity <= 0) {
            this.orderItems.splice(itemIndex, 1);
        }

        // Save the changes to the cart order
        return this.save();
    }

    // If the item is not found in the cart, return the cart order without changes
    return Promise.resolve(this);
};

module.exports = mongoose.model('CartOrder', cartOrderSchema); 