const express = require("express");
const router = express.Router();
const {addSubcategory,getAllSubcategories,removeSubcategory,} = require("../controllers/subcategory.controller");
const { authenticate } = require("../midllewares/auth.middleware");
const { authorize } = require("../midllewares/role.middleware");

router.post("/",authenticate,authorize("admin"),addSubcategory);
router.delete("/:id",authenticate,authorize("admin"), removeSubcategory);
router.get("/",getAllSubcategories);
module.exports = router;