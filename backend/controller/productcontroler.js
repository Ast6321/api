const database = require("../model/categoryschema");
const productdb = require("../model/productschema")
const uploadToCloudinary = require("../utils/uploadtocloudinary");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");



exports.products = async (req, res) => {
  try {

    const { name, description, category, variants } = req.body;

  
    const existcategory = await database.findById(category);
    if (!existcategory) {
      return res.status(404).json({ message: "category does not exist" });
    }

  
    let images = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "products");

        images.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    let parsedVariants = [];

    if (variants) {
      const variantArray = JSON.parse(variants);

      
      const skuSet = new Set();

      for (let v of variantArray) {

        if (skuSet.has(v.sku)) {
          return res.status(400).json({ message: "Duplicate SKU found" });
        }

        skuSet.add(v.sku);

        parsedVariants.push({
          color: v.color,
          size: v.size,
          price: v.price,
          stock: v.stock || 0,
          sku: v.sku
        });
      }
    }

  
    const newproduct = new productdb({
      name,
      description,
      category,
      images,
      variants: parsedVariants
    });

    const saveproduct = await newproduct.save();

    res.status(201).json({
      message: "product added successfully",
      productdata: saveproduct
    });

  } catch (err) {
    res.status(500).json({ message: "server error", err });
  }
};


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
      filter.variants = {
        $elemMatch: {}
      };

      if (minprice) filter.variants.$elemMatch.price = { $gte: Number(minprice) };
      if (maxprice) {
        filter.variants.$elemMatch.price = {
          ...filter.variants.$elemMatch.price,
          $lte: Number(maxprice)
        };
      }
    }

   
    let sortOption = {};
    if (sort === "lowtohigh") sortOption["variants.price"] = 1;
    if (sort === "hightolow") sortOption["variants.price"] = -1;

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
      data,
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

    const { name, description, category, variants } = req.body;

    const product = await productdb.findById(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    
    if (category) {
      const existcategory = await database.findById(category);
      if (!existcategory) {
        return res.status(404).json({ message: "category does not exist" });
      }
      product.category = category;
    }

    
    if (req.files && req.files.length > 0) {

      
      for (let img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      let newImages = [];

      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "products");

        newImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }

      product.images = newImages;
    }

    
    if (variants) {
      const variantArray = JSON.parse(variants);

      const skuSet = new Set();
      let parsedVariants = [];

      for (let v of variantArray) {

        if (skuSet.has(v.sku)) {
          return res.status(400).json({ message: "Duplicate SKU found" });
        }

        skuSet.add(v.sku);

        parsedVariants.push({
          color: v.color,
          size: v.size,
          price: v.price,
          stock: v.stock || 0,
          sku: v.sku
        });
      }

      product.variants = parsedVariants;
    }

   
    if (name) product.name = name;
    if (description) product.description = description;

    const updated = await product.save();

    res.status(200).json({
      message: "product updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: "server error", err });
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
      return res.status(404).json({ message: "product not found" });
    }

    
    for (let img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await productdb.findByIdAndDelete(id);

    res.status(200).json({
      message: "product deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "server failure", err });
  }
};