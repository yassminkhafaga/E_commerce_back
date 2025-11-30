const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},
    comment: { type: String, required: true },
    rating: { type: Number, required: true ,min: 1, max: 5},
    status: {type: String,enum: ["pending", "approved", "rejected"],default: "pending",},
    isVisible: { type: Boolean, default: false }, // للعرض على الموقع بعد الموافقة
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
