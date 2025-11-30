///register
///login

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");   
/////registe
exports.register= async (req,res)=>{
    try {
        const {name,email,password,address,phone}=req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({name,email,password:hashedPassword,address,phone});
        res.status(200).json({message:`User ${name} added successfully `,data:user});
    } catch (error) {
        res.status(400).json({message:"Something went wrong"});
    }
}
///////////////////////////
/////login & token
const signToken = (user)=>
{
    return jwt.sign(
        {id:user._id,role:user.role,name:user.name},
        process.env.SECRET_KEY,
        {expiresIn:process.env.JWT_EXPIRES_IN}
)
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const myUser = await User.findOne({ email });

  if (!myUser) {
    return res.status(404).json({ message: "invalid email or password" });
  }
  const correctPassword = await myUser.correctPassword(password); //check pass
  if (!correctPassword) {
    return res.status(404).json({ message: "invalid email or password" });
  }
  const token = signToken(myUser);
  res.status(200).json({ message: "Login successfully", token });
}
    
