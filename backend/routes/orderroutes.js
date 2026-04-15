const express = require("express");
const orderrouter = express.Router();

const { placeOrder , getMyOrders } = require("../controller/ordercontroller");
const {verifyToken} = require("../middlewares/authmiddleware");


orderrouter.post("/place", verifyToken, placeOrder);

orderrouter.get("/my", verifyToken, getMyOrders);



module.exports = orderrouter;