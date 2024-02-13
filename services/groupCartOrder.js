const catchAsyncError = require('../middlewares/catchAsyncError');
const Item = require('../models/items') ; 
const Cart = require('../models/cartOrders');   

exports.getItem =  catchAsyncError(async(itemId)=>{ 
      const item  = await Item.findById({_id: itemId}) ; 
      return item ;          
}) ; 

exports.getCart = catchAsyncError(async(cartId)=>{  
       const cart  = await Cart.findOne({_id: cartId}) ;  
       console.log("services" , cart) ; 
       return cart ; 
})