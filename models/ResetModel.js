import mongoose from "mongoose";
const ResetSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
// module.exports = Reset = mongoose.model("reset", ResetSchema);
let Reset = mongoose.model('reset', ResetSchema); //first parameter shows the collection name created on mongodb 'user'
export default Reset;