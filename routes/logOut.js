const express = require("express");
const router = express.Router();
const path = require("path");
const handlelogOut = require("../controller/logOutController");
router.get("/", handlelogOut);
module.exports = router;
