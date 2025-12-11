///addSubcategory
///getAllSubcategories
///removeSubcategory

const Subcategory = require("../models/subcategory.model");
const Category = require("../models/category.model");
/////////add subcategory
exports.addSubcategory = async(req,res)=>{
    const{name,categoryId}=req.body;
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(400).json({message:"Category not found"});
    }
    const subcategory = await Subcategory.create({ name, category:category._id });
    res.status(200).json({message:"Subcategory added successfully",data:subcategory});
}
//////////////
///////////get all subcategories
exports.getAllSubcategories=async(req,res)=>{
    const subcategories = await Subcategory.find();
    res.status(200).json({message:"All subcategories",data:subcategories});
}
////////////////////////

//////////remove subcategory 
exports.removeSubcategory=async(req,res)=>{
    const id = req.params.id;
    const subcategory = await Subcategory.findByIdAndUpdate(id,{isDeleted:true});
    if(!subcategory){
        return res.status(404).json({message:"Subcategory not found"});
    }
    res.status(200).json({message:"Subcategory deleted successfully",data:subcategory});
}
///////////////////////
