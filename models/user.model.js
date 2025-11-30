const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSquema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    address:{type:String,required:true},
    phone:{type:Number,required:true},
    role:{type:String,required:true,enum:['admin','user']},
},{timestamps:true});

/////////hash password when create or update
userSquema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    
})

/////////////compare user password validation
userSquema.methods.correctPassword = async function (inputPassword){
    return await bcrypt.compare(inputPassword,this.password);
}


module.exports = mongoose.model('User',userSquema);
