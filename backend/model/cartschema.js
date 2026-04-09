
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",   
    required: true
  },

  sku: {               
    type: String,
    required: true
  },

  color: String,
  size: String,

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },

  price: {              
    type: Number,
    required: true
  },

  name: String,         
  image: String         

}, { _id: false });


const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },

  items: [cartItemSchema]

}, { timestamps: true });


module.exports = mongoose.model("carts", cartSchema);