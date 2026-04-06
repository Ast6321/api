const mongoose = require("mongoose");

const productschema = new mongoose.Schema(

    {
        image: {
            url: String,
            public_id: String

        },
        name: {
            type: String,
            required: true

        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {

            type: mongoose.Schema.Types.ObjectId,
            ref: "cateogories",
            required: true
                   
        },
        stock: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("products", productschema);