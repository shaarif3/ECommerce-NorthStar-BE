import Category from "../models/CategoryModel.js";
const getallcategories = async (req, res) => {
    if (req.user.role !== "admin") return res.status(401).json({
        message: "Please Login Via Admin To Access!",
    });
    try {
        const category = await Category.find().lean();
        await res.status(200).json({
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: err.toString(),
        });
    }
};

const createCateogory = async (req, res) => {
    const { categoryName, status } = req.body;
    try {
        const category = new Category({
            categoryName,
            status,
        });
        await category.save();
        return res.status(200).json({ msg: "Category Created", category });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: "Server Error" });
    }
};

const editCategory = async (req, res) => {
    const { categoryName, status } = req.body;
    try {
        const category = await Category.findById(req.params.id);
        category.categoryName = categoryName ? categoryName : category.categoryName;
        category.status = status ? status : category.status;
        await category.save();
        return res.status(200).json({ msg: "Category Edited", category });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ msg: "Server Error" });
    }
};

const toggleStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        console.log("category", category);
        category.status = category.status == true ? false : true;
        await category.save();
        console.log("CatStatus", category);
        res.status(200).json({
            msg: category.status ? "Category Activated" : "Category Deactivated",
        });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(500).json({ msg: "No Category found to toggle" });
        }
    }
};

const categoryDetails = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        console.log("Category", category);
        return res.status(200).json({ category });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(500).json({ msg: "No Category found" });
        }
    }
};

const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndRemove(req.params.id);
        res.status(200).json({ msg: "Category was successfully deleted" });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "No Category Found" });
        }
    }
};

const logs = async (req, res) => {
    try {
        const searchParam = req.query.searchString
            ? {
                $or: [
                    {
                        categoryName: {
                            $regex: `${req.query.searchString}`,
                            $options: "i",
                        },
                    },
                ],
            }
            : {};
        const status_filter = req.query.status ? { status: req.query.status } : {};
        const from = req.query.from;
        const to = req.query.to;
        let dateFilter = {};
        if (from && to)
            dateFilter = {
                createdAt: {
                    $gt: new Date(from),
                    $lt: new Date(to),
                },
            };
        //   console.log("req.query.labTechnicianId", req.query.labTechnicianId);
        const category = await Category.paginate(
            {
                ...searchParam,
                ...status_filter,
                ...dateFilter,
            },
            {
                page: req.query.page ? req.query.page : 1,
                limit: req.query.perPage ? req.query.perPage : 10,
                lean: true,
            }
        );
        await res.status(200).json({
            category,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.toString(),
        });
    }
};

export const categoryFunc = {
    getallcategories,
    createCateogory,
    editCategory,
    toggleStatus,
    categoryDetails,
    deleteCategory,
    logs,
};
