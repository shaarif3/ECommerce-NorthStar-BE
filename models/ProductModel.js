import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        category: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Category",
        },

        productName: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
        productImage: { type: Array, required: true },
        price: {
            type: Number,
        },
        instock: {
            type: Number,
        },
        description: {
            type: String,
        },
        usage: {
            type: String,
        },
        size: {
            type: [{ String }],
            required: true
        }
    },
    { timestamps: true }
);
let Product = mongoose.model('Product', ProductSchema); //first parameter shows the collection name created on mongodb 'user'
export default Product;