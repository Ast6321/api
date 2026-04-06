const database = require("../model/categoryschema");
const cloudinary = require("../config/cloudinary")
const uploadToCloudinary = require("../utils/uploadtocloudinary");
const { buffer } = require("stream/consumers");





exports.category = async (req, res) => {
    try {
        let imagedata = {};

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer , "categories");
            imagedata = {
                url: result.secure_url,
                public_id: result.public_id
            };
                
        }


        const newcategory = new database({
            name: req.body.name || "unname",
            slug: req.body.slug || "unslug",
            description: req.body.description || "undescripted",
            order: Number(req.body.order) || 0,
            status: req.body.status || "active",
            featured: req.body.featured === "true" || false,
            image: imagedata || {}
        });

   


        const saveddata = await newcategory.save();

        res.status(200).json({ message: "successfullly added", data: saveddata })


    }
    catch (err) {
        
        res.status(500).json({ message: "server error",err })
    }
}







exports.getcategory = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 4, 1);

        const skip = (page - 1) * limit;

        const data = await database.find().sort({ order: 1 }).skip(skip).limit(limit);
        const total = await database.countDocuments();
        const totalpages = Math.ceil(total / limit);

        if (page > totalpages) {
            return res.status(200).json(
                {
                    message: "no data ",
                    data: [],
                    page,
                    total,
                    totalpages
                })
        }


        res.status(200).json(
            {
                message: "data fetch successfuly",
                data: data,
                page,
                total,
                totalpages
            })

    }
    catch (err) {
        res.status(500).json({ message: "unable to get data", err })
    }
}










exports.delcategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await database.findById(id);
        
        if (!category) {
            return res.status(404).json({ message: "Not found" });
        }

        const publicid = category.image?.public_id;


        if (publicid) {
          await cloudinary.uploader.destroy(publicid);
        }

        const deletecategory = await database.findByIdAndDelete(id);

        res.status(200).json({ message: "category deleted successfuly", data: deletecategory })
    }
    catch (err) {
        res.status(500).json({ message: "server failure", err })
    }
}









exports.updatecategory = async (req, res) => {
  try {
    const id = req.params.id;
    const bodydata = req.body;

    const predata = await database.findById(id);

    if (!predata) {
      return res.status(404).json({ message: "user not found" });
    }

    let updateddata = { ...bodydata };

    if (req.file) {

      const publicid = predata.image?.public_id;

     
      if (publicid) {
        await cloudinary.uploader.destroy(publicid);
      }

      const imagedata = await uploadToCloudinary(req.file.buffer , "categories");

      updateddata.image = {
        url: imagedata.secure_url,
        public_id: imagedata.public_id
      };
    }


    const finalupdate = await database.findByIdAndUpdate(
      id,
      updateddata,
      { returnDocument:"after" }
    );

    res.status(200).json({
      message: "user updated successfully",
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