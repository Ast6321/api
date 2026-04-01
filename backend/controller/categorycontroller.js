const database = require("../model/categoryschema");
const fs = require("fs");


exports.category = async (req, res) => {
    try {


        const newcategory = new database({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            order: Number(req.body.order),
            status: req.body.status,
            featured: req.body.featured === "true",
            image: req.file ? "/uploads/" + req.file.filename : ""
        });


        const saveddata = await newcategory.save();

        res.status(200).json({ message: "successfullly added", data: saveddata })


    }
    catch (err) {

        res.status(500).json({ message: "server error" })
    }
}


exports.getcategory = async (req, res) => {
    try {
        const categories = await database.find().sort({order:1});

        res.status(200).json({ message: "data fetch successfully", data: categories })
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