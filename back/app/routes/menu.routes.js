const express = require("express");
const { authJwt } = require("../middleware");
const menuController = require("../controllers/menu.controller");

const router = express.Router();

router.get("/client/week-menu/:date", menuController.getWeekMenuForClient);

router.get("/client/week-menu/", menuController.getWeekMenuForClient);

router.get("/client/:id", menuController.getOneWithCommande);

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isCantineOrAdmin);

router.get("/admin/week-menu/:date", menuController.getWeekMenuForAdmin);

router.get("/:id", menuController.getOne);

router.post("/", menuController.createOne);

router.put("/:id", menuController.updateOne);

router.delete("/", menuController.deleteMany);

router.delete("/:id", menuController.deleteOne);

module.exports = router;
