///addUser
///getAllUsers

const User = require('../models/user.model');
/////add user
exports.addUser = (role)=>{
    return async(req,res)=>{
        const {name,email,password,address,phone}=req.body;
        const user = await User.create({name,email,password,address,phone,role});
        res.status(200).json({message:"User added successfully",data:user});
    }

}

/////////////////////get all users 
exports.getAllUsers = async (req,res)=>{
 try{ const { page = 1, limit = 10 } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const users = await User.find().skip(skip).limit(limitNumber);
  // حساب العدد الكلي وعدد الصفحات
  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limitNumber);

  res.status(200).json({ message: "All users", data: users,pagination:{totalUsers,totalPages ,currentPage:pageNumber,pageSize:limitNumber}});
 } catch (error) {
     res.status(500).json({ error: "error in getting users" });
 }
}