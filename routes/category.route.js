const {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getSubcategoriesByCategory,
  getCategoriesWithSubcategories,
} = require("../controllers/category.controller");
const express = require("express");
const router = express.Router();
const { upload } = require("../midllewares/upload.middleware");
const { authenticate } = require("../midllewares/auth.middleware");
const { authorize } = require("../midllewares/role.middleware");

router.get("/",getAllCategories);
router.get("/with-subcategories",getCategoriesWithSubcategories);
router.get("/:categoryId", getSubcategoriesByCategory);
router.post("/",authenticate,authorize("admin"),upload.single("image"),addCategory);
router.delete("/:id", authenticate, authorize("admin"), deleteCategory);
router.put("/:id",authenticate,authorize("admin"),upload.single("image"),updateCategory);
module.exports = router;
