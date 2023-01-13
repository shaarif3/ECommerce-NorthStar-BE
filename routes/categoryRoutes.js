import express from "express";
const router = express.Router();
import { categoryFunc } from "../controllers/categoryControllers.js"
import passport from "passport";
const {
    getallcategories,
    createCateogory,
    editCategory,
    toggleStatus,
    categoryDetails,
    deleteCategory,
    logs,
} = categoryFunc;

router.post("/createCategory", createCateogory);
router.get("/logs", passport.authenticate('jwt', { session: false }), logs);
router.get("/details/:id", passport.authenticate('jwt', { session: false }), categoryDetails);
router.get("/toggleStatus/:id", passport.authenticate('jwt', { session: false }), toggleStatus);
router.post("/editCategory/:id", passport.authenticate('jwt', { session: false }), editCategory);
router.get("/getAllCats", passport.authenticate('jwt', { session: false }), getallcategories);
router.delete("/deleteCategory/:id", passport.authenticate('jwt', { session: false }), deleteCategory);
export default router;
