import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phone: {
            type: Number,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        status: {
            type: Boolean,
            default: true,
        },

        userImage: { type: String },
        role: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// module.exports = Admin = mongoose.model("User", UserSchema);
let User = mongoose.model('User', UserSchema); //first parameter shows the collection name created on mongodb 'user'
export default User;