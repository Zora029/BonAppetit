const express = require("express");
const { authJwt } = require("../middleware");
const categorieController = require("../controllers/categorie.controller");

const router = express.Router();

router.get("/", categorieController.getAll);

router.get("/:id", categorieController.getOne);

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isCantineOrAdmin);

router.post("/", categorieController.createOne);

router.put("/:id", categorieController.updateOne);

router.delete("/", categorieController.deleteMany);

router.delete("/:id", categorieController.deleteOne);

module.exports = router;
