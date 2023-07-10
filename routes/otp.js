const express = require("express");
const router = express.Router();
const path = require("path");
const handleOTP = require("../controller/otpController");
router
  .get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "views", "otp.html"));
  })
  .post("/", handleOTP);

module.exports = router;
