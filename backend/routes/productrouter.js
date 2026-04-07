const express = require("express");
const productrouter  = express.Router();

const upload = require("../middlewares/uploadmiddleware");

const {products, getproducts} = require("../controller/productcontroler");



productrouter.post("/",upload.single("image"),products);


productrouter.get("/" , getproducts);





module.exports = productrouter;