///addToCart
///removeFromCart
///getMyCart
///clearCart
///updateCartItemQuantity

const Cart = require("../models/cart.model");
exports.addToCart = async (req, res) => {
    try{
        const {product_id,quantity}=req.body;
        const user_id = req.user._id;
        const product = await Product.findById(product_id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        //create new cart and add product after chck if product exist
        const itemPrice = product.price;
        let cart = await Cart.findOne({ user_id });
        if(!cart){
            cart = await Cart.create({ user_id, items: [{ product_id, quantity, price: itemPrice }] });
            return res.status(200).json({ message: "Product added to cart successfully", data: cart });
        }
        //check if product from front exist
        const inderex = cart.items.findIndex((item) => item.product_id.toString() === product_id);
        //if exist update quantity else add new product
        if (inderex !== -1) {
            cart.items[inderex].quantity += quantity;
        } else {
            cart.items.push({ product_id, quantity, price: itemPrice });
        }
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully", data: cart });
    }catch(err){
        res.status(400).json({message:"Something went wrong in add to cart"});
    }
}; 
//////////////
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.params;

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product_id.toString() !== product_id
    );
    await cart.save();

    res.status(200).json({ message: "Item removed", data: cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
};

//////////////
exports.getMyCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user_id: userId }).populate("items.product_id");
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", data: [] });}
////total price
    const count = cart.items.length;
    const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity,0);

    res.status(200).json({ message: "My cart", data: cart, count, total });
    } catch (err) {
    res.status(500).json({ message: "Error getting cart" });
  }
};
////////////////
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndDelete({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart cleared", data: cart });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};

////////////
exports.updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, quantity } = req.body;
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const index = cart.items.findIndex((i) => i.product_id.toString() === product_id);
    if (index === -1)
      return res.status(404).json({ message: "Item not found" });
    cart.items[index].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Quantity updated", data: cart });
    } catch (err) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};
/////////////