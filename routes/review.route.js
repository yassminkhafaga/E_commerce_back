const express = require("express");
const router = express.Router();
const { authorize } = require("../midllewares/role.middleware");
const { authenticate } = require("../midllewares/auth.middleware");
const {addReview,getMyReviews,getAllReviews,changeReviewStatus}=require('../controllers/review.controller');

router.post("/",authenticate,addReview);
router.get("/myreviews",authenticate,getMyReviews);
router.get("/",authenticate,authorize("admin"), getAllReviews);
router.put("/:id",authenticate,authorize("admin"),changeReviewStatus);
module.exports = router;