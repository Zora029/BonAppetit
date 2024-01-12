const express = require("express");
const { authJwt, uploadImage } = require("../middleware");
const utilisateurController = require("../controllers/utilisateur.controller");

const router = express.Router();

router.get("/information", utilisateurController.getPersonalInformation);

router.get("/preferences", utilisateurController.getPreferences);

router.put("/preferences", utilisateurController.updatePreferences);

router.post("/adorer/:id", utilisateurController.adorerPlat);

router.get(
  "/preferences/:id",
  authJwt.isAdmin,
  utilisateurController.getPreferences
);

router.put(
  "/preferences/:id",
  authJwt.isAdmin,
  utilisateurController.updatePreferences
);

router.get("/all", authJwt.isAdmin, utilisateurController.getAll);

router.get("/all-ids", authJwt.isAdmin, utilisateurController.getAllIds);

router.get(
  "/all-ids/:role",
  authJwt.isAdmin,
  utilisateurController.getAllIdsByRole
);

router.get("/:id", authJwt.isAdmin, utilisateurController.getOne);

router.post("/", authJwt.isAdmin, uploadImage.single("file"), utilisateurController.createOne);

router.put("/:id", authJwt.isAdmin, uploadImage.single("file"), utilisateurController.updateOne);

router.delete("/", authJwt.isAdmin, utilisateurController.deleteMany);

router.delete("/:id", authJwt.isAdmin, utilisateurController.deleteOne);

module.exports = router;
