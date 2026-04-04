const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema(
    
    {
    image:{
        url:String,
        public_id:String
        
    },
    name:{
        type:String,
        required:true
       
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    order:{
        type:Number,
        required:true,
        
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    featured:{
        type:Boolean,
        default: false
    }
},
{
    timestamps: true
}
);


module.exports = mongoose.model("cateogories",categoryschema);