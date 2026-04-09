const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
  {
    name: {
      type: String,
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

   
    images: [
      {
        url: String,
        public_id: String,
        _id:false
        
      }
    ],

   
    variants: [
      {
        color: {
          type: String,
          required: true
        },

        size: {
          type: String,
          required: true
        },

        price: {
          type: Number,
          required: true
        },

        stock: {
          type: Number,
          default: 0
        },

        sku: {
          type: String,
          required: true,
          unique: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("products", productschema);