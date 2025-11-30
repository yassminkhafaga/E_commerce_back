const {addToCart,removeItem,getMyCart,clearCart,updateItemQuantity,} = require("../controllers/cart.controller");
const express = require("express");
const router = express.Router();

router.post('/',addToCart);
router.delete("/removeItem/:id", removeItem);
router.get('/',getMyCart);
router.delete("/clearCart", clearCart);
router.put("/", updateItemQuantity);
module.exports=router;