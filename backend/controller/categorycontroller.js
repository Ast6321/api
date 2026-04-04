const database = require("../model/categoryschema");
const fs = require("fs");

const uploadToCloudinary = require("../utils/uploadtocloudinary");


exports.category = async (req, res) => {
    try {
        let imagedata = {};

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imagedata = {
                url: result.secure_url,
                public_id: result.public_id
            };


        }


        const newcategory = new database({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            order: Number(req.body.order),
            status: req.body.status,
            featured: req.body.featured === "true",
            image: imagedata
        });


        const saveddata = await newcategory.save();

        res.status(200).json({ message: "successfullly added", data: saveddata })


    }
    catch (err) {

        res.status(500).json({ message: "server error" })
    }
}


// exports.getcategory = async (req, res) => {
//     try {
//         const categories = await database.find().sort({ order: 1 });

//         res.status(200).json({ message: "data fetch successfully", data: categories })
//     }
//     catch (err) {
//         res.status(500).json({ message: "unable to get data", err })
//     }
// }

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


        if (category.image) {
            fs.unlinkSync("." + category.image);
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
        const categorydata = req.body;
        const updateimage = req.file;
        const predata = await database.findById(id);
        if (!predata) {
            return res.status(404).json({ message: "user not found" });
        }

        if (updateimage && predata.image) {

            if (fs.existsSync(predata.image)) {
                fs.unlinkSync(predata.image);
            }
        }

        const updateddata = { ...categorydata };

        if (updateimage) {
            updateddata.image = updateimage.path;
        }

        const finalupdate = await database.findByIdAndUpdate(id, updateddata, { returnDocument: "after" })

        res.status(200).json({ message: "userupdated successfully", finalupdate });




    }
    catch (err) {

        res.status(500).json({
            message: "server error",
            err
        })
    }
}