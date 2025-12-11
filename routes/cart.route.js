const {
  addToCart,
  getMyCart,
  clearCart,
  updateItemQuantity,
  removeFromCart,
  updateQuantity,
  getItem
} = require("../controllers/cart.controller");
const express = require("express");
const router = express.Router();
const { authenticate } = require("../midllewares/auth.middleware");

router.post('/',authenticate,addToCart);
router.post("/remove",authenticate, removeFromCart);
router.get("/", authenticate,getMyCart);
router.post("/clearCart",authenticate, clearCart);
router.put("/quantity", authenticate, updateQuantity);
router.put("/update-quantity",authenticate, updateItemQuantity);
router.get("/item/:product_id", authenticate, getItem);
module.exports=router;