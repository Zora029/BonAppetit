const express = require("express");
const { authJwt } = require("../middleware");
const overviewController = require("../controllers/overview.controller");

const router = express.Router();

router.get(
  "/cantine-overview",
  authJwt.isAdmin,
  overviewController.getCantineOverview
);

module.exports = router;
