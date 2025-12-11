///getAllOrders
///createOrder
///getMyOrders
///updateOrderStatusAdmin
///updateOrderStatusUser
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

////
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find().populate("user_id").populate("orderItems.product_id").sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / Number(limit));

    res.status(200).json({message: "All orders",data: orders,pagination: {totalOrders,totalPages,currentPage: Number(page),pageSize: Number(limit),},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting orders" });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const { userID, phone, address } = req.body;
    if (!phone || !address)
      return res.status(400).json({ message: "Phone and address are required" });

    const targetCart = await Cart.findOne({ user_id: userID }).populate("items.product_id");
    if (!targetCart) return res.status(404).json({ message: "Cart not found" });
    if (targetCart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let total_price = 0;
    const finalOrderItems = [];
    for (let item of targetCart.items) {
      const product = await Product.findById(item.product_id);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.product_id}` });
      total_price += product.price * item.quantity;
      finalOrderItems.push({product_id: item.product_id,quantity: item.quantity,price: product.price,name: product.name,});
    }

    const newOrder = await Order.create({user_id: req.user._id,orderItems: finalOrderItems,phone,address,total_price,status: "pending",date: new Date(),});
    await Cart.updateOne({ user_id: userID }, { $set: { items: [] } });
    res.status(201).json({ message: "Order created successfully", data: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .populate("user_id")
      .populate("orderItems.product_id")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "My orders", data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user orders" });
  }
};

// Admin update
exports.updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "canceled",
      "refunded",
      "rejected",
    ];

    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("user_id").populate("orderItems.product_id");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated by admin", data: order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// User update
exports.updateOrderStatusUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user_id.toString() !== user._id.toString())
      return res
        .status(403)
        .json({ message: "Not allowed to change this order" });

    // Rules for user
    if (order.status === "delivered" && status === "refunded") {
      order.status = "refunded";
    } else if (["pending", "processing"].includes(order.status)) {
      if (["canceled", "rejected"].includes(status)) {
        order.status = status;
      } else {
        return res
          .status(403)
          .json({ message: "User cannot change to this status" });
      }
    } else {
      return res
        .status(403)
        .json({ message: "User cannot change this order status" });
    }

    await order.save();
    const updatedOrder = await Order.findById(order._id)
      .populate("user_id")
      .populate("orderItems.product_id");

    res
      .status(200)
      .json({ message: "Order status updated by user", data: updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};
