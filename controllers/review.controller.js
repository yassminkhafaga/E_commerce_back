///addReview
///getMyReviews
///getAllReviews
///changeReviewStatus
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if ( !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const review = await Review.create({user_id: req.user._id,rating,comment,});
        res.status(200).json({ message: "Review added, waiting for approval", data: review });
    } catch (err) {
        res.status(500).json({ message: "Error adding review" });
  }
};
/////
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "My reviews", data: reviews });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};
////
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user_id", "name email").sort({ createdAt: -1 });
    res.status(200).json({ message: "All reviews", data: reviews });
  } catch (err) {
    res.status(500).json({ message: "Error fetching all reviews" });
  }
};

/////
exports.changeReviewStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; // approved or rejected
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });}
    const review = await Review.findByIdAndUpdate(id,{ status,isVisible:status === "approved" },{ new: true });
    res.status(200).json({ message: "Review status updated", data: review });
  } catch (err) {
    res.status(500).json({ message: "Error updating review" });
  }
};

