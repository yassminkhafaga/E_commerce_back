////addToCart
///getMyCart
///removeFromCart
///updateQuantity
///clearCart
///updateItemQuantity
///getItem

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { product_id, quantity } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({
        user_id,
        items: [
          {
            product_id,
            quantity: quantity || 1,
            price: product.price,
          },
        ],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id.toString()
      );
      if (index > -1) {
        cart.items[index].quantity += quantity || 1;
      } else {
        cart.items.push({product_id,quantity: quantity || 1,price: product.price,});
      }
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.product_id");
    res.status(200).json({message: "Item added to cart",data: populatedCart,});
  } catch (err) {
    res.status(500).json({message: "Server Error",error: err.message,});
  }
};

// Get my cart
exports.getMyCart = async (req, res) => {
  try {
    const user_id = req.user?._id; 
    const cart = await Cart.findOne({ user_id }).populate(
      "items.product_id",
      "name price image stock slug"
    );

    if (!cart) return res.status(200).json({ data: [] });
    res.status(200).json({ data: cart.items });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id } = req.body;
    if (!product_id)
      return res.status(400).json({ message: "Product ID is required" });
    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== product_id);
    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id, action } = req.body;

    if (!product_id || !action)
      return res
        .status(400)
        .json({ message: "product_id and action are required" });

    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product_id.toString() === product_id);
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    if (action === "inc") {
      item.quantity += 1;
    } else if (action === "dec") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items = cart.items.filter(
          (i) => i.product_id.toString() !== product_id
        );
      }
    } else {
      return res.status(400).json({ message: "Invalid action (inc/dec)" });
    }

    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const cart = await Cart.findOne({ user_id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update item quantity directly
exports.updateItemQuantity = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id, quantity } = req.body;

    if (!product_id || quantity == null)
      return res
        .status(400)
        .json({ message: "product_id and quantity are required" });

    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (i) => i.product_id.toString() === product_id
    );
    if (index === -1)
      return res.status(404).json({ message: "Item not found" });

    cart.items[index].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Quantity updated", data: cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
///////////////

exports.getItem = async (req, res) => {
  try {
    const user_id = req.user?._id;
    const { product_id } = req.params;

    const cart = await Cart.findOne({ user_id }).populate("items.product_id");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product_id._id.toString() === product_id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ data: item });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
