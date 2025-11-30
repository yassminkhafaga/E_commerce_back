///addProduct
///deleteProduct
///getAllProducts
///getProductBySlug
///updateProduct
const Product = require('../models/product.model');
/////add product
exports.addProduct=async(req,res)=>{
    const {name,price,category,supCategory,image,stock,description,slug}=req.body;
    const imgURL = req.file.filename;
  
    const product = await Product.create({
    name,
    price,
    category,
    supCategory,
    image: imgURL,
    stock,
    description,
    slug,
  });
    res.status(200).json({message:"Product added successfully",data:product});
}
////////////delete product 
exports.deleteProduct=async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id,{isDeletes:true});
    if(product){
        res.status(200).json({message:"Product deleted successfully",data:product});
    }
    else{
        res.status(404).json({message:"Product not found"});
    }
}
///////////get all products
exports.getAllProducts = async (req, res) => {
  try {
    const {
      sort,
      order,
      minPrice,
      maxPrice,
      keyword,
      page = 1,
      limit = 10,
      ...filters
    } = req.query;

    // تحويل page و limit لـ Number
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // فلتر الأساسي (Soft Delete)
    let filter = { isDeletes: false, ...filters };

    // فلترة السعر لو موجود
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // فلتر keyword على الاسم أو الوصف لو موجود
    if (keyword) {
      const regex = new RegExp(keyword, "i"); // i عشان يكون case-insensitive
      filter.$or = [{ name: regex }, { description: regex }];
    }

    // إعداد sort
    let sortObj = {};
    if (sort) sortObj[sort] = order === "desc" ? -1 : 1;

    // جلب المنتجات مع pagination و sort
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber);

    // عدد المنتجات الكلي وعدد الصفحات
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNumber,
        pageSize: limitNumber,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};


//////////get product by slug
exports.getProductBySlug=async(req,res)=>{
    const slug = req.params.slug;
    const product = await Product.findOne({slug,isDeletes:false});
    if(product){
        res.status(200).json({message:"Product found",data:product});
    }
    else{
        res.status(404).json({message:"Product not found"});
    }
}
////////////
////update product
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update only provided fields
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.price) updates.price = req.body.price;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.supCategory) updates.supCategory = req.body.supCategory;
    if (req.body.image) updates.image = req.body.image;
    if (req.body.stock) updates.stock = req.body.stock;
    if (req.body.description) updates.description = req.body.description;

    // auto update slug if name changed
    if (req.body.name) {
      updates.slug = req.body.name.toLowerCase().replace(/\s+/g, "-");
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
    res.status(500).json({ message: "Something went wrong in update product" });
  }
};
