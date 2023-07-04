const express = require("express");
const router = express.Router();
const path = require("path");
const handleAuth = require("../controller/authController");

router
  .get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "views", "auth.html"));
  })
  .post("/", handleAuth);

module.exports = router;
