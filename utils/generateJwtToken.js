import jwt from "jsonwebtoken";
const generateToken = (user) => {
    return jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
export default generateToken;
// module.exports = generateToken;
