const database = require("../model/categoryschema");
const productdb = require("../model/productschema")
const uploadToCloudinary = require("../utils/uploadtocloudinary");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");







exports.products = async (req, res) => {
  try {


    const { name, price, description, category, stock } = req.body;
    let imgdata = {};


    const existcategory = await database.findById(category);
    if (!existcategory) {
      return res.status(404).json({ message: "category does not exist" })
    }



    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "products");
      imgdata = {
        url: result.secure_url,
        public_id: result.public_id
      };

    }

    const newproduct = new productdb({
      name,
      price,
      description,
      category,
      stock,
      image: imgdata
    });


    const saveproduct = await newproduct.save();

    res.status(201).json({ message: "product added successfuly", productdata: saveproduct });

  }
  catch (err) {
    res.status(500).json({ message: "server error", err })
  }
}





exports.getproducts = async (req, res) => {
  try {

    let filter = {};

    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.max(Number(req.query.limit || 9), 1);
    const skip = (page - 1) * limit;

    const { category, minprice, maxprice, sort } = req.query;


    if (category) {
      filter.category = { $in: category.split(",") };
    }


    if (minprice || maxprice) {
      filter.price = {};

      if (minprice) filter.price.$gte = Number(minprice);
      if (maxprice) filter.price.$lte = Number(maxprice);
    }


    let sortOption = {};
    if (sort === "lowtohigh") sortOption.price = 1;
    if (sort === "hightolow") sortOption.price = -1;


    const total = await productdb.countDocuments(filter);
    const totalpage = Math.ceil(total / limit) || 1;


    const data = await productdb
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    if (page > totalpage) {
      return res.status(200).json({
        message: "no data",
        data: [],
        page,
        total,
        totalpage
      });
    }

    res.status(200).json({
      message: "data fetched successfully",
      data: data,
      page,
      total,
      totalpage
    });

  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};




exports.updateproduct = async (req, res) => {
  try {
    const id = req.params.id;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid product id" });
    }


    const bodydata = req.body;

    const predata = await productdb.findById(id);

    if (!predata) {
      return res.status(404).json({ message: "product not found" });
    }

    if (!req.file && Object.keys(bodydata).length === 0) {
      return res.status(400).json({ message: "no data provided" });
    }

    let updateddata = { ...bodydata };

    if (req.file) {

      const publicid = predata.image?.public_id;


      if (publicid) {
        await cloudinary.uploader.destroy(publicid);
      }

      const imagedata = await uploadToCloudinary(req.file.buffer, "products");

      updateddata.image = {
        url: imagedata.secure_url,
        public_id: imagedata.public_id
      };
    }


    const finalupdate = await productdb.findByIdAndUpdate(
      id,
      updateddata,
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "product updated successfully",
      data: finalupdate
    });

  } catch (err) {
    console.error("PATCH ERROR:", err);
    res.status(500).json({
      message: "server error",
      error: err.message
    });
  }
};





exports.delproduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "invalid product id" });
    }
    const product = await productdb.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    const publicid = product.image?.public_id;


    if (publicid) {
      await cloudinary.uploader.destroy(publicid);
    }

    const deleteproduct = await productdb.findByIdAndDelete(id);

    res.status(200).json({ message: "product deleted successfuly", data: deleteproduct })
  }
  catch (err) {
    res.status(500).json({ message: "server failure", err })
  }
};