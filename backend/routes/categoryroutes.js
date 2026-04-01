const express = require("express");
const router  = express.Router();

const upload = require("../middlewares/uploadmiddleware");

const {category,getcategory,delcategory} = require("../controller/categorycontroller")




router.post("/",upload.single("image"),category);

router.get("/",getcategory);
router.delete("/:id",delcategory);

module.exports = router;