const express = require("express");
const router = express.Router();
const path = require("path");
const handleRegister = require("../controller/registerController");
router
  .get("/", (req, res) => {
    res
      .status(200)
      .sendFile(path.join(__dirname, "..", "views", "register-patient.html"));
  })
  .post("/", handleRegister);

module.exports = router;
