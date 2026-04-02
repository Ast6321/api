const express = require("express");
const router  = express.Router();

const upload = require("../middlewares/uploadmiddleware");

const {category,getcategory,delcategory,updatecategory} = require("../controller/categorycontroller");




router.post("/",upload.single("image"),category);

router.get("/",getcategory);
router.delete("/:id",delcategory);
router.patch("/:id",upload.single("image"),updatecategory);

module.exports = router;