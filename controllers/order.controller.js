///getAllOrders
///createOrder
///getMyOrder
///updateOrderStatus

const Order = require ('../models/order.model');
const Product = require('../models/product.model');
//get all orders
exports.getAllOrders = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;
      const orders = await orderSquema
        .find()
        .populate("user_id")
        .populate("orderItems.product_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);
      // حساب العدد الكلي وعدد الصفحات
      const totalOrders = await orderSquema.countDocuments();
      const totalPages = Math.ceil(totalOrders / limitNumber);

      res.status(200).json({ message: "All orders", data: orders ,pagination:{totalOrders,totalPages ,currentPage:pageNumber,pageSize:limitNumber}});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error in getting orders" });
    }
};
///////////
///add& create order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, phone, address } = req.body;

    // 1) Validate fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }
    if (!phone || !address) {
      return res
        .status(400)
        .json({ message: "Phone and address are required" });
    }

    let total_price = 0;
    let finalOrderItems = [];

    // 2) loop على كل items ونتأكد إن المنتج موجود وناخد السعر الحقيقي
    for (let item of orderItems) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product_id}` });
      }

      const itemPrice = product.price;
      const itemName = product.name;

      total_price += itemPrice * item.quantity;

      finalOrderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: itemPrice, // السعر من DB
        name: itemName, // الاسم من DB
      });
    }

    // 3) إنشاء الأوردر
    const newOrder = await Order.create({
      user_id: req.user._id, // مهم جدًا
      orderItems: finalOrderItems,
      phone,
      address,
      total_price,
      status: "pending",
      date: new Date(),
    });

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating order" });
  }
};
/////////////
////getMyOrder for user
exports.getMyOrder = async (req, res) => {
    try {
        const orders = await orderSquema.find({ user_id: req.user._id }).populate('user_id').populate('orderItems.product_id').sort({ createdAt: -1 });
        res.status(200).json({message:"My orders",data:orders});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error in getting orders" });
    }   
}

//////
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;         // order id
    const { status } = req.body;       // new status

    // Allowed statuses
    const allowed = ["pending", "processing", "shipped", "delivered", "canceled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await orderSquema.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return updated doc
    ).populate("user_id")
     .populate("orderItems.product_id");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
