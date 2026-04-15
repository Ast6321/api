const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({

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
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  name: String,
  image: String

}, { _id: false });


const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  items: [orderItemSchema],

  totalAmount: {
    type: Number,
    required: true
  },

  address: {
    name: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String
  },

  paymentMethod: {
    type: String,
    default: "COD"
  },

  paymentStatus: {
    type: String,
    default: "pending"
  },

  orderStatus: {
    type: String,
    default: "placed"
  }

}, { timestamps: true });


module.exports = mongoose.model("orders", orderSchema);