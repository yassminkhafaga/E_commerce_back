const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  getMyOrders,
  updateOrderStatusUser,
  updateOrderStatusAdmin,
} = require("../controllers/order.controller");

const { authorize } = require("../midllewares/role.middleware");
const { authenticate } = require("../midllewares/auth.middleware");

router.get("/", authenticate, authorize("admin"), getAllOrders);
router.post("/", authenticate, createOrder);
router.get("/myorder", authenticate, getMyOrders);
router.put("/admin/:id", authenticate,authorize("admin"),updateOrderStatusAdmin);
router.put("/user/:id", authenticate, authorize("user"), updateOrderStatusUser);
module.exports = router;
