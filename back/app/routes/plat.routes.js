const express = require("express");
const { authJwt, uploadImage } = require("../middleware");
const platController = require("../controllers/plat.controller");

const router = express.Router();

router.get("/all", platController.getAll);

router.get("/all/with-adorer", platController.getAllWithAdorer);

router.get("/one/with-adorer/:id", platController.getOneWithAdorer);

router.get("/one/:id", platController.getOne);

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isCantineOrAdmin);

router.get("/all/plat-menu-options/", platController.getAllPlatMenuOptions);

router.post("/", uploadImage.single("file"), platController.createOne);

router.put("/:id", uploadImage.single("file"), platController.updateOne);

router.delete("/", platController.deleteMany);

router.delete("/:id", platController.deleteOne);

module.exports = router;
