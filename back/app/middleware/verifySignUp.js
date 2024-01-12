const db = require("../models");
const Utilisateur = db.utilisateur;

checkDuplicateMatriculeUtilisateur = (req, res, next) => {
  Utilisateur.findOne({
    where: {
      matricule_utilisateur: req.body.matricule_utilisateur,
    },
  }).then((utilisateur) => {
    if (utilisateur) {
      res.status(400).send({
        message: "Failed! matricule_utilisateur is already in use!",
      });
      return;
    }

    next();
  });
};

const verifySignUp = {
  checkDuplicateMatriculeUtilisateur: checkDuplicateMatriculeUtilisateur,
};

module.exports = verifySignUp;
