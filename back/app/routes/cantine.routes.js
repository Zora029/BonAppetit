const express = require("express");
const { authJwt } = require("../middleware");
const cantineController = require("../controllers/cantine.controller");

const router = express.Router();

router.get("/", cantineController.getAll);

router.get("/:id", cantineController.getOne);

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isAdmin);

router.post("/", cantineController.createOne);

router.put("/:id", cantineController.updateOne);

router.delete("/", cantineController.deleteMany);

router.delete("/:id", cantineController.deleteOne);

module.exports = router;
