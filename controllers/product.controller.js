///addProduct
///deleteProduct
///getAllProducts
///getProductBySlug
///updateProduct
///getProductsAndSubCategories
///getProductsBySubcategory

const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");

exports.addProduct = async (req, res) => {
  const {
    name,
    price,
    categoryId,
    subCategoryId,
    image,
    stock,
    description,
    slug,
  } = req.body;

  const subcategory = await Subcategory.findById(subCategoryId);
  if (!subcategory || subcategory.category.toString() !== categoryId) {
    return res
      .status(400)
      .json({ message: "Subcategory does not belong to this category" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }
  const imgURL = req.file.filename;
  const product = await Product.create({
    name,
    price,
    category: categoryId,
    subCategory: subCategoryId,
    image: imgURL,
    stock,
    description,
    slug,
  });
  res
    .status(201)
    .json({ message: "Product added successfully", data: product });
};
////////////delete product
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, { isDeleted: true });
  if (product) {
    res
      .status(200)
      .json({ message: "Product deleted successfully", data: product });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};
///////////get all products
exports.getAllProducts = async (req, res) => {
  try {
    const {
      sort,
      order,
      category,
      subCategory,
      minPrice,
      maxPrice,
      keyword,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isDeleted: false };

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortObj = {};
    if (sort) sortObj[sort] = order === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("category")
      .populate("subCategory")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        size: limitNum,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};

//////////get product by slug
exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug, isDeleted: false }).populate("subCategory").populate("category");
    
  if (product) {
    res.status(200).json({ message: "Product found", data: product });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

////

// exports.getProductByid = async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid product id" });
//     }
//     const product = await Product.findOne({ _id: id, isDeleted: false }).populate("subCategory").populate("category");
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ message: "Product found", data: product });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching product", error: err.message });
//   }
// };

////////////
exports.getProductsAndSubCategories = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategories = await Subcategory.find({ category: categoryDoc._id });
    const products = await Product.find({category: categoryDoc._id,isDeleted: false,}).populate("subCategory");

    res.status(200).json({message: "Data fetched successfully",data: { products, subCategories },});
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
};

////update product

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updates = { ...req.body };
  
    if (req.file) {updates.image = {filename: req.file.filename,url: `/uploads/${req.file.filename}`,};
    }
  
    if (req.body.name && req.body.name !== product.name) {
      let newSlug = req.body.name.toLowerCase().replace(/\s+/g, "-");
      const existingProduct = await Product.findOne({slug: newSlug,_id: { $ne: id },});
      if (existingProduct) {
        newSlug += `-${Date.now()}`;
      }

      updates.slug = newSlug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};
//////////////

exports.getProductsBySubcategory = async (req, res) => {
  try {
    const subId = req.params.id;
    const products = await Product.find({subCategory: subId,isDeleted: false,}).populate("subCategory");
    res.status(200).json({message: "Products fetched successfully",data: products,});
  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
};


