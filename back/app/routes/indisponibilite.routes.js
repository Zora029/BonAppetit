const express = require("express");
const { authJwt } = require("../middleware");
const indisponibiliteController = require("../controllers/indisponibilite.controller");

const router = express.Router();

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isAdmin);

router.get("/", indisponibiliteController.getAll);

router.get("/:id", indisponibiliteController.getOne);

router.post("/", indisponibiliteController.createOne);

router.post("/create-many", indisponibiliteController.createMany);

router.put("/:id", indisponibiliteController.updateOne);

router.delete("/", indisponibiliteController.deleteMany);

router.delete("/:id", indisponibiliteController.deleteOne);

module.exports = router;
