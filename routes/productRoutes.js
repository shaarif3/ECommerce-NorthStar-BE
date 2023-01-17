import express from "express";
const router = express.Router();
import { productFunc } from "../controllers/productController.js"
import passport from "passport";

const { getallproducts,
    addProduct,
    productDetails,
    logs,
    toggleStatus,
    searchProduct,
    editProduct,
    getProductsByCategory, } = productFunc;

router.post("/addProduct", passport.authenticate('jwt', { session: false }), addProduct);
router.post("/editProduct/:id", passport.authenticate('jwt', { session: false }), editProduct);
router.get("/toggleActiveStatus/:id", passport.authenticate('jwt', { session: false }), toggleStatus);
router.get("/getProductDetails/:id", productDetails);
router.get("/logs", passport.authenticate('jwt', { session: false }), logs);
router.get("/searchProduct/:term", searchProduct);
router.get("/getProductByCategory/:category", getProductsByCategory);
router.get("/getAllProducts", getallproducts);
export default router;

