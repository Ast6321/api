const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema(
    
    {
    image:{
        type:String,
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
        unique:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    featured:{
        type:Boolean,
        defalut: false
    }
},
{
    timestamps: true
}
);


module.exports = mongoose.model("cateogories",categoryschema);