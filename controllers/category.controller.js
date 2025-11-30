///addCategory
///deleteCategory
///getAllCategories
///updateCategory
const Category = require("../models/category.model"); 
////////////add category
exports.addCategory = async (req, res) => {
    try{
     const {name,slug}=req.body;
     const category = await Category.create({name,slug});
     res.status(200).json({message:"Category added successfully",data:category});
    }catch(err){
        res.status(400).json({message:"Something went wrong in add category"});
    }
}  

////////////////////////////////
//////delete category by slug
exports.deleteCategory = async (req, res) => {
    try{
     const id = req.params.id;
     const category = await Category.findByIdAndDelete(id);
     if(!category){
        return res.status(404).json({message:"Category not found"});
     }
     res.status(200).json({message:"Category deleted successfully",data:category});

    }catch(err){
        res.status(400).json({message:"Something went wrong in delete category"});
    }
}
/////////////////////
/////get all categories
exports.getAllCategories = async (req, res) => {
    try{
     const categories = await Category.find();
     res.status(200).json({message:"All categories",data:categories});
    }catch(err){
        res.status(400).json({message:"Something went wrong in get all categories"});
    }
}
///////////////
//////update category 
exports.updateCategory = async (req, res) => {
    try{
const id = req.params.id;
const {name,slug}=req.body;
const category = await Category.findByIdAndUpdate(id,{name,slug});
res.status(200).json({message:"Category updated successfully",data:category});
if(!category){
    return res.status(404).json({message:"Category not found"});
}
    }catch(err){
        res.status(400).json({message:"Something went wrong in update category"});
    }
}