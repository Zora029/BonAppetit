const express = require("express");
const { authJwt } = require("../middleware");

const commandeController = require("../controllers/commande.controller");

const router = express.Router();

router.get("/one/:id", commandeController.getOne);

router.post("/", commandeController.createOne);

router.put("/client-update/:id", commandeController.updateOneForClient);

router.put(
  "/taking-commmand-for-client/:id",
  commandeController.takingCommandeForClient
);

router.delete("/:id", commandeController.deleteOne);

// **************** ADMIN OR CANTINE ONLY *******************

router.use(authJwt.isCantineOrAdmin);

router.get(
  "/all-commandes-of-the-day",
  commandeController.getAllCommandesOfTheDayAPI
);

router.get(
  "/commande-list-for-weekly-report/:date",
  commandeController.getCommandListForWeeklyReport
);

router.get(
  "/commande-count-for-weekly-report/:date",
  commandeController.getCommandCountForMonthlyReport
);

router.post(
  "/generate-default-choices/:id",
  commandeController.defaultChoicesForMenu
);

// **************** ADMIN ONLY *******************

router.use(authJwt.isAdmin);

router.get("/all/", commandeController.getAll);

router.post("/:matricule", commandeController.createOne);

router.put("/admin-update/:id", commandeController.updateOneForAdmin);

router.put(
  "/admin-update-all-commande-com-to-np-from-date/:date",
  commandeController.updateAllCommandeComToNPFromDate
);

router.delete("/", commandeController.deleteMany);

module.exports = router;
