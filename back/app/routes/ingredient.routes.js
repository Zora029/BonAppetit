const express = require("express");
const { authJwt } = require("../middleware");
const ingredientController = require("../controllers/ingredient.controller");

const router = express.Router();

router.get("/", ingredientController.getAll);

router.get("/:id", ingredientController.getOne);

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isCantineOrAdmin);

router.post("/", ingredientController.createOne);

router.put("/:id", ingredientController.updateOne);

router.delete("/", ingredientController.deleteMany);

router.delete("/:id", ingredientController.deleteOne);

module.exports = router;
