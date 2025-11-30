const mongoose = require('mongoose');
const connectDB = async()=>{
    try {
        const connectionString = process.env.MONGO_URI;
        await mongoose.connect(connectionString);
        console.log('DB connected');
    }
        catch(err){
console.log(err.message);
process.exit(1);
        }
    
}
module.exports = connectDB;