const express = require("express");
const productrouter  = express.Router();

const upload = require("../middlewares/uploadmiddleware");

const {products, getproducts,updateproduct,delproduct} = require("../controller/productcontroler");



productrouter.post("/",upload.array("image"),products);


productrouter.get("/" , getproducts);
productrouter.patch("/:id",upload.array("image"),updateproduct);
productrouter.delete("/:id",delproduct);





module.exports = productrouter;