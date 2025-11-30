///removeSubcategory
///addSubcategory
///getSubcategoryBySlug
///getAllSubcategories
const Subcategory = require("../models/subcategory.model");

/////////add subcategory
exports.addSubcategory = async(req,res)=>{
    const{name,slug,category}=req.body;
    const subcategory = await Subcategory.create({ name, slug, category });
    res.status(200).json({message:"Subcategory added successfully",data:subcategory});
}
//////////////

/////////////get subcategory by slug
exports.getSubcategoryBySlug=async(req,res)=>{
    const slug = req.params.slug;
    const subcategory = await Subcategory.findOne({ slug });
    if(subcategory){
        res.status(200).json({message:"Subcategory found",data:subcategory});
    }
    else{
        res.status(404).json({message:"Subcategory not found"});
    }
}
/////////////////////
///////////get all subcategories
exports.getAllSubcategories=async(req,res)=>{
    const subcategories = await Subcategory.find();
    res.status(200).json({message:"All subcategories",data:subcategories});
}
////////////////////////

//////////remove subcategory 
exports.removeSubcategory=async(req,res)=>{
    const id = req.params.id;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if(!subcategory){
        return res.status(404).json({message:"Subcategory not found"});
    }
    res.status(200).json({message:"Subcategory deleted successfully",data:subcategory});
}
///////////////////////