const express = require('express');
const router = express.Router();
const {getAllOrders,createOrder,getMyOrder,updateOrderStatus,} = require("../controllers/order.controller");
const {authorize}=require('../midllewares/role.middleware');
const {authenticate} = require("../midllewares/auth.middleware");


router.get("/",authenticate,authorize("admin"),getAllOrders);
router.post("/",createOrder);
router.get("/myorder",getMyOrder);
router.put("/:id",authenticate,authorize("admin"),updateOrderStatus);
module.exports = router;