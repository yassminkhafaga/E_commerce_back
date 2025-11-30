const mongoose =require('mongoose');
const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:mongoose.Schema.Types.ObjectId,ref:'Category',required:true},
    supCategory:{type:mongoose.Schema.Types.ObjectId,ref:'Subcategory',required:true},
    image:{type:String,required:true},
    stock:{type:Number,default:0},
    description:{type:String,required:true},
     isDeletes:{type:Boolean, default:false},
    slug:{type:String,required:true,unique:true}  
},{timestamps:true});
module.exports = mongoose.model('Product',productSchema);
