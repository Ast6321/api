const database = require("../model/categoryschema");
const productdb = require("../model/productschema")
const uploadToCloudinary = require("../utils/uploadtocloudinary");







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
      data,
      page,
      total,
      totalpage
    });

  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};
