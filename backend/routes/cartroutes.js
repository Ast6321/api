const express = require("express");
const cartrouter  = express.Router();
const {verifyToken} = require("../middlewares/authmiddleware");



const {addToCart, getCart ,updateCart,deleteCartItem } = require("../controller/cartcontroller");



cartrouter.post("/add", verifyToken, addToCart);
cartrouter.get("/",verifyToken,getCart);
cartrouter.patch("/update",verifyToken,updateCart);
cartrouter.delete("/delete",verifyToken,deleteCartItem);








module.exports = cartrouter;