import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
        },
        count: { type: Number, default: 0 },

        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

let Category = mongoose.model('Category', CategorySchema); //first parameter shows the collection name created on mongodb 'user'
export default Category;