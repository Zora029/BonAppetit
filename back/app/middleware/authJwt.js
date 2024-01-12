const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const Utilisateur = db.utilisateur;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({
      message: "Aucun token trouvé!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Non authorisé!",
      });
    }
    req.matricule = decoded.matricule;
    next();
  });
};

isAdmin = (req, res, next) => {
  Utilisateur.findByPk(req.matricule).then((utilisateur) => {
    if (utilisateur.role_utilisateur === "admin") {
      next();
      return;
    }

    res.status(403).send({
      message: "Accès refusé!",
    });
    return;
  });
};

isCantine = (req, res, next) => {
  Utilisateur.findByPk(req.matricule).then((utilisateur) => {
    if (utilisateur.role_utilisateur === "cantine") {
      next();
      return;
    }

    res.status(403).send({
      message: "Accès refusé!!",
    });
    return;
  });
};

isCantineOrAdmin = (req, res, next) => {
  Utilisateur.findByPk(req.matricule).then((utilisateur) => {
    if (
      utilisateur.role_utilisateur === "cantine" ||
      utilisateur.role_utilisateur === "admin"
    ) {
      next();
      return;
    }

    res.status(403).send({
      message: "Accès refusé!!",
    });
    return;
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isCantine: isCantine,
  isCantineOrAdmin: isCantineOrAdmin,
};
module.exports = authJwt;
