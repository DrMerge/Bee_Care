const express = require("express");
const router = express.Router();
const path = require("path");
const handleRefresh = require("../controller/refreshController");
router.get("/", handleRefresh);
module.exports = router;
