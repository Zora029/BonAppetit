const express = require("express");
const { authJwt } = require("../middleware");
const notificationController = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", notificationController.getAll);

router.get("/preview", notificationController.getPreview);

router.get("/:id", notificationController.getOne);

// **************** ADMIN ONLY *******************

router.use(authJwt.isAdmin);

router.post("/", notificationController.createOne);

router.put("/:id", notificationController.updateOne);

router.delete("/", notificationController.deleteMany);

router.delete("/:id", notificationController.deleteOne);

module.exports = router;
