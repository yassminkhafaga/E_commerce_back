const express = require("express");
const router = express.Router();
const {addProduct,deleteProduct,getAllProducts,getProductBySlug,updateProduct,
} = require("../controllers/product.controller");
const { upload } = require("../midllewares/upload.middleware");
const { authenticate } = require("../midllewares/auth.middleware");
const { authorize } = require("../midllewares/role.middleware");  

router.get("/", getAllProducts);
router.delete("/:id",deleteProduct)
router.post("/", upload.single("image"), addProduct);
router.get("/:slug", getProductBySlug);
router.put("/:id",authenticate,authorize("admin"),upload.single("image"),updateProduct);
module.exports = router;
