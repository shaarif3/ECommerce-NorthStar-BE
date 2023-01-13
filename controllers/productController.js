import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
// const { path } = require("express/lib/application");
import Mongoose from "mongoose";


const addProduct = async (req, res) => {
    const {
        category,
        productName,
        status,
        price,
        instock,
        description,
        usage,
        size
    } = req.body;
    // let _reciepts = [];
    // const reciepts = [];
    // _reciepts = req.files.reciepts;
    // console.log("_reciepts", _reciepts);
    // if (!Array.isArray(_reciepts)) throw new Error("Reciepts Required");
    // _reciepts.forEach((img) => reciepts.push(img.path));
    try {
        const product = new Product({
            category,
            attribute,
            productName,
            status,
            price,
            instock,
            description,
            usage,
            // productImage: reciepts,
            size
        });
        console.log("Product Added", product)

        // if (product) {
        //     const cat = await Category.findOne({ _id: category });
        //     cat.count = cat.count + 1;
        //     const updatedCat = await cat.save();
        //     console.log("UpdatedCat", updatedCat);
        //     const productCreate = await product.save();
        //     console.log("ProductCreated", productCreate);
        //     res.status(200).json({ msg: "product Created", productCreate });
        // }
    } catch (err) {
        return res.status(500).json({ msg: "Server Error" });

    }
};

const getallproducts = async (req, res) => {
    try {
        const product = await Product.find().lean();
        await res.status(200).json({
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: err.toString(),
        });
    }
};

const searchProduct = async (req, res) => {
    try {
        let product = await Product.find({ productName: req.query.searchParam });
        if (product) {
            return res.status(200).json({ product });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.toString(),
        });
    }
};



const editProduct = async (req, res) => {
    // // console.log("Old Product", req.body);
    // return;
    const { category, attribute, name, status, price, instock, description } =
        req.body;
    console.log("req.body", req.body);
    let _reciepts = [];
    const reciepts = [];
    _reciepts = req.files.reciepts;
    console.log("_reciepts", _reciepts);
    _reciepts.forEach((img) => reciepts.push(img.path));
    try {
        const product = await Product.findById(req.params.id);
        console.log("Before Edit");
        console.log("Old Product", category);

        if (product) {
            console.log("req.status", req.body.status);
            product.category = category ? category : product.category;
            product.attribute = attribute ? attribute : attribute.category;
            product.name = name ? name : product.name;
            product.status = status == "true" ? true : false;
            product.price = price ? price : product.price;
            product.instock = instock ? instock : product.instock;
            product.description = description ? description : product.description;
            product.productImage = reciepts ? reciepts : product.productImage;
        }
        console.log("type of productImage", typeof product.productImage);
        console.log("type of receipts", typeof reciepts);
        console.log("type of status", typeof status);
        await product.save();
        return res.json({ product });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "No Product Found" });
        }
    }
};

const productDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "category attribute"
        );
        console.log("product", product);
        return res.status(200).json({ product });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(500).json({ msg: "No Category found" });
        }
    }
};

const logs = async (req, res) => {
    try {
        const searchParam = req.query.searchString
            ? {
                $or: [
                    {
                        productName: {
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
        let cat_filter = {};

        if (req.query.category) {
            console.log("req.params.category", req.params.category);
            cat_filter = {
                category: req.query.category,
            };
        }
        //   console.log("req.query.labTechnicianId", req.query.labTechnicianId);
        const product = await Product.paginate(
            {
                ...cat_filter,
                ...searchParam,
                ...status_filter,
                ...dateFilter,
            },
            {
                lean: true,
                sort: "_id",
                populate: "category attribute",
            }
        );
        await res.status(200).json({
            product,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.toString(),
        });
    }
};

const toggleStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        console.log("category", product);
        product.status = product.status == true ? false : true;
        await product.save();
        console.log("CatStatus", product);
        res.status(200).json({
            msg: product.status ? "Product Activated" : "Product Deactivated",
        });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(500).json({ msg: "No Attribute found to toggle" });
        }
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.paginate(
            {
                category: req.params.category,
            },
            {
                page: req.query.page ? req.query.page : "1",
                limit: req.query.perPage ? req.query.perPage : "10",
                lean: true,
            }
        );
        return res.status(200).json({
            products,
        });
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res
                .status(500)
                .json({ msg: "No Product found of this Category " });
        }
    }
};



export const productFunc = {
    getallproducts,
    addProduct,
    productDetails,
    logs,
    toggleStatus,
    searchProduct,
    editProduct,
    getProductsByCategory,
};