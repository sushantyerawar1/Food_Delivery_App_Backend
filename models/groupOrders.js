const mongoose = require("mongoose");

const groupOrderSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  groupId: {
    type: Number,
    required: true,
  },
  groupName: {
    type: String,
    required: false,
  },

  userIds: [
    {
      type: String,
    },
  ],
  hotelName: {
    type: String,
    required: false,
  },
  userMobileNumber: {
    type: Number,
    // ref: 'User',
    required: false,
  },
  hotelMobileNumber: {
    type: Number,
    // ref: 'User',
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  cartItems: {
    type: Map,
    of: [
      {
        userId: {
          type: String,
        },
        userName: {
          type: String,
        },
        items: [
          {
            name: {
              type: String,
            },
            price: {
              type: Number,
            },
            quantity: {
              type: Number,
            },
            itemID: {
              type: String,
            },
            imageLink: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  orderStatus: {
    type: String,
    default: "ORDER_PENDING"
  }
});

groupOrderSchema.methods.addItem = function (userId, userName, item) {
  const cartItem = this.cartItems.get(userId);
  // console.log(cartItem); 
  if (!cartItem) {
    (this.cartItems.get(userId))[0] = {
      userId: userId,
      userName: userName,
      items: [
        {
          name: item.name,
          price: item.price,
          quantity: 1,
          itemID: item.id,
          imageLink: item.imageLink,
        },
      ],
    };
  } else {
    // console.log("here" ,(this.cartItems.get(userId))[0].items) ;
    const existingItem = (this.cartItems.get(userId))[0].items.find(
      (Item) => Item.itemID == item.itemID
    );
    // console.log(existingItem);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      (this.cartItems.get(userId))[0].items.push({
        name: item.name,
        price: item.price,
        quantity: 1,
        itemID: item.itemID,
        imageLink: item.imageLink,
      });
    }
    this.save().then(() => {
      // console.log(this.cartItems) ;
      return this.cartItems
    });
  }
};

groupOrderSchema.methods.addCartToGroup = function (cart, userId, userName) {
  // console.log(userMobileNumber, hotelMobileNumber, 'hotelMobileNumberhotelMobileNumberhotelMobileNumberhotelMobileNumberhotelMobileNumber');
  this.cartItems.set(userId, {
    userId: userId,
    userName: userName,
    items: cart.orderItems,
    // hotelMobileNumber: hotelMobileNumber,
    // userMobileNumber: userMobileNumber
  });
  // console.log(this.cartItems) ;
  this.save().then(() => {
    // console.log(this.cartItems) ;
    return this.cartItems
  });
};

groupOrderSchema.methods.removeItem = function (userId, userName, item) {
  const cartItem = this.cartItems.get(userId);
  // console.log(car)
  if (cartItem) {
    const index = (this.cartItems.get(userId))[0].items.findIndex(
      (Item) => Item.itemID === item.itemID
    );
    // console.log(index) ; 
    if (index !== -1) {

      (this.cartItems.get(userId))[0].items[index].quantity -= 1;

      if ((this.cartItems.get(userId))[0].items[index].quantity <= 0) {
        (this.cartItems.get(userId))[0].items.splice(index, 1);
      }
      this.save().then(() => {
        // console.log(this.cartItems) ;
        return this.cartItems
      });
    }
  }
  return Promise.resolve(this);
};

groupOrderSchema.methods.deleteItem = function (userId, userName, item) {
  const cartItem = this.cartItems.get(userId);
  // console.log("here", cartItem) ; 
  if (cartItem) {
    const index = (this.cartItems.get(userId))[0].items.findIndex(
      (Item) => Item.itemID === item.itemID
    );
    if (index !== -1) {
      (this.cartItems.get(userId))[0].items.splice(index, 1);
      this.save().then(() => {
        // console.log(this.cartItems) ;
        return this.cartItems
      });
    }

  }
  return Promise.resolve(this);
};

groupOrderSchema.methods.deleteCart = function (userId, userName) {
  const cartItem = this.cartItems.get(userId);
  // console.log(cartItem) ;
  if (cartItem) {
    this.cartItems.delete(userId);
    this.save().then(() => {
      // console.log(this.cartItems) ;
      return this.cartItems
    });
  }
  return Promise.resolve(this);
};

// Example usage:
// const GroupOrder = mongoose.model('GroupOrder', groupOrderSchema);
// const order = new GroupOrder({
//     adminID: "admin123",
//     hotelID: "hotel456",
//     groupNumber: 1,
//     userIds: ["user123"],
//     cartItems: new Map(),
// });

// // Adding cart items for a specific user
// const userId = "user123";
// const userName = "John Doe";
// const cartItemsForUser = [{
//     name: "Item1",
//     price: 10,
//     quantity: 2,
//     itemID: "item123",
//     imageLink: "imageurl",
// }];

// order.cartItems.set(userId, { userId, userName, items: cartItemsForUser });

// // Save the order
// order.save(function (err) {
//     if (err) return console.error(err);
//     console.log("Order saved successfully!");
// });

module.exports = mongoose.model("GroupOrder", groupOrderSchema);
