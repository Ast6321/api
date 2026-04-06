const database = require("../model/categoryschema");
const productdb = require("../model/productschema")
const uploadToCloudinary = require("../utils/uploadtocloudinary");







exports.products = async (req,res) =>{
    try{
      
      
       const {name, price , description , category , stock} = req.body;
       let imgdata = {};
       

      const existcategory = await database.findById(category);
      if(!existcategory){
        return res.status(404).json({message:"category does not exist"})
      }

   

      if(req.file){
        const result = await uploadToCloudinary(req.file.buffer ,"products" );
        imgdata = {
                url: result.secure_url,
                public_id: result.public_id
            };

      }

      const newproduct = new productdb ({
        name,
        price,
        description,
        category,
        stock,
        image:imgdata 
      });


      const saveproduct = await newproduct.save();

      res.status(201).json({message:"product added successfuly" , productdata:saveproduct});

    }
    catch(err){
        res.status(500).json({ message: "server error",err })
    }
}