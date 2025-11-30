const{addUser,getAllUsers}=require('../controllers/user.controller');
const express = require("express");
const router = express.Router();
const {authorize}=require('../midllewares/role.middleware');
const {authenticate} = require("../midllewares/auth.middleware");

router.post("/adduser",addUser("user"));
router.get("/getallusers", authenticate, authorize("admin"), getAllUsers);
router.post("/addadmin", authenticate, authorize("admin"), addUser("admin"));

module.exports = router;