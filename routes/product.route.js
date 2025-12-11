const express = require("express");
const router = express.Router();
const {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  getProductsAndSubCategories,
  getProductsBySubcategory,
  
} = require("../controllers/product.controller");
const { upload } = require("../midllewares/upload.middleware");
const { authenticate } = require("../midllewares/auth.middleware");
const { authorize } = require("../midllewares/role.middleware");  

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.get("/subcategory/:id", getProductsBySubcategory);
router.get("/category/:id", getProductsAndSubCategories);
router.delete("/:id", authenticate, authorize("admin"),  deleteProduct);
router.post("/",
  // authenticate,authorize("admin")
upload.single("image"),addProduct);
router.put("/:id",authenticate, authorize("admin"),upload.single("image"),updateProduct);
module.exports = router;
