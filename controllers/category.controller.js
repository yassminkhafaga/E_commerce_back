///addCategory
///deleteCategory
///getAllCategories
///updateCategory
///getSubcategoriesByCategory
//getCategoriesWithSubcategories
const Category = require("../models/category.model"); 
const Subcategory = require("../models/subcategory.model");
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json({
      message: "Category added successfully",
      data: category, // <--- هنا الـ object كامل مع _id
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({
        message: "Something went wrong in add category",
        error: err.message,
      });
  }
};

/////get all categories
exports.getAllCategories = async (req, res) => {
    try{
     const categories = await Category.find({isDeleted:false});
     res.status(200).json({message:"All categories",data:categories});
    }catch(err){
        res.status(400).json({message:"Something went wrong in get all categories"});
    }
}
///////////////
// update category
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    let image = existingCategory.image;
    if (req.file) {
      image = req.file.filename; 
    }
    const updatedCategory = await Category.findByIdAndUpdate(id,{ name, description, image },{ new: true, runValidators: true } )
    res.status(200).json({ message: "Category updated successfully",data: updatedCategory,});
  } catch (err) {
    console.error("UPDATE CATEGORY ERROR:", err);
    res.status(400).json({
      message: "Something went wrong in update category",
      error: err.message,
    });
  }
};

//////delete category
exports.deleteCategory = async (req, res) => {
    try{
     const id = req.params.id;
     const category = await Category.findByIdAndUpdate(id,{isDeleted:false});
     if(!category){
        return res.status(404).json({message:"Category not found"});
     }
     res.status(200).json({message:"Category deleted successfully",data:category});

    }catch(err){
        res.status(400).json({message:"Something went wrong in delete category"});
    }
}

////////////
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({category: categoryId,isDeleted: false,});
    res.status(200).json({message: `Subcategories for this category`,data: subcategories,});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//////
///aggregation
exports.getCategoriesWithSubcategories = async function (req, res) {
  try {
    const data = await Category.aggregate([
      {
        $match: { isDeleted: false }, 
      },
      {
        $lookup: {
          from: "subcategories", 
          localField: "_id",
          foreignField: "category",
          as: "subcategories",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          image: 1,
          subcategories: {
            $filter: {
              input: "$subcategories",
              as: "sub",
              cond: { $eq: ["$$sub.isDeleted", false] }, 
            },
          },
        },
      },
    ]);

    res.status(200).json({message: "Categories with subcategories fetched successfully",data, });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
}
