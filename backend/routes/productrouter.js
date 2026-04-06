const express = require("express");
const productrouter  = express.Router();

const upload = require("../middlewares/uploadmiddleware");

const {products} = require("../controller/productcontroler");



productrouter.post("/",upload.single("image"),products);








module.exports = productrouter;