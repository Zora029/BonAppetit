const express = require("express");

const { verifySignUp } = require("../middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/signup",
  [verifySignUp.checkDuplicateMatriculeUtilisateur],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
