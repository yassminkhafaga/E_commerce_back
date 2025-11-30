const express = require("express");
const router = express.Router();
const {
  addSubcategory,
  getSubcategoryBySlug,
  getAllSubcategories,
  removeSubcategory,
} = require("../controllers/subcategory.controller");

router.post("/", addSubcategory);
router.get("/", getSubcategoryBySlug);
router.delete("/:id", removeSubcategory);
router.get("/:slug", getAllSubcategories);
module.exports = router;