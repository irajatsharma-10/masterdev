// Import the required modules
const express = require("express");
const router = express.Router();

const { captuerPayment, verifyPayment, paymentSuccessEmail } = require("../Controllers/Payment")
const { auth, isStudent} = require("../Middleware/auth");
router.get("/captuerPayment", auth, isStudent, captuerPayment);
router.post("/verifyPayment",auth, isStudent, verifyPayment);
router.post("/paymentSuccessEmail", auth, isStudent, paymentSuccessEmail);

module.exports = router;