const db = require("../models");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const Utilisateur = db.utilisateur;
const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Add new Utilisateur.',
      schema: { $ref: '#/definitions/Register' }
    } 
  */
  const _utilisateur = req.body;
  if (
    !(
      _utilisateur.matricule_utilisateur &&
      _utilisateur.nom_utilisateur &&
      _utilisateur.prenom_utilisateur &&
      _utilisateur.email_utilisateur &&
      _utilisateur.tel_utilisateur &&
      _utilisateur.poste_utilisateur &&
      _utilisateur.role_utilisateur &&
      _utilisateur.mot_de_passe
    )
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  Utilisateur.create({
    ..._utilisateur,
    mot_de_passe: bcrypt.hashSync(_utilisateur.mot_de_passe, 8),
  })
    .then((utilisateur) => {
      res.status(200).json({ message: "Inscription terminée!" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.login = (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Login Utilisateur.',
      schema: { $ref: '#/definitions/Login' }
    } 
  */
  const _utilisateur = req.body;
  if (!(_utilisateur.matricule_utilisateur && _utilisateur.mot_de_passe)) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  Utilisateur.findOne({
    where: {
      matricule_utilisateur: _utilisateur.matricule_utilisateur,
    },
  })
    .then((utilisateur) => {
      if (!utilisateur) {
        return res.status(404).json({ message: "Aucun utilisateur trouvé." });
      }

      var passwordIsValid = bcrypt.compareSync(
        _utilisateur.mot_de_passe,
        utilisateur.mot_de_passe
      );

      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: "Mot de passe invalide!",
        });
      }

      const token = jwt.sign(
        {
          matricule: utilisateur.matricule_utilisateur,
        },
        config.secret,
        {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        }
      );
      res.status(200).json({
        matricule: utilisateur.matricule_utilisateur,
        role: utilisateur.role_utilisateur,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
