const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
//database connection
const connectDB = require("./config/dataDB");
connectDB();
//routes
app.use('/product',require('./routes/product.route'));
app.use('/user',require('./routes/user.route'));
app.use('/category',require('./routes/category.route'));
app.use('/auth',require('./routes/auth.route'));
app.use('/subcategory',require('./routes/subcategory.route'));
app.use('/order',require('./routes/order.route'));  
app.use('/cart',require('./routes/cart.route'));
app.use('/review',require('./routes/review.route'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on prot ${port}`);
});
