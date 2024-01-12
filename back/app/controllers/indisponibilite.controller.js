const db = require("../models");
const Indisponibilite = db.indisponibilite;

exports.createOne = (req, res) => {
  const _indisponibilite = req.body;
  if (!_indisponibilite.date_ind) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  Indisponibilite.create({
    date_ind: _indisponibilite.date_ind,
    matricule_utilisateur: _indisponibilite.matricule_utilisateur
      ? _indisponibilite.matricule_utilisateur
      : null,
  })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de l'indisponibilité.",
      });
    });
};

exports.createMany = async (req, res) => {
  const _indisponibilite = req.body;
  const matricule = _indisponibilite.matricule_utilisateur
    ? _indisponibilite.matricule_utilisateur
    : null;
  if (_indisponibilite.date_ind.length < 1) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const indisponibilites = _indisponibilite.date_ind.map((date) => ({
      date_ind: date,
      matricule_utilisateur: matricule,
    }));

    await Indisponibilite.bulkCreate(indisponibilites);

    res.status(200).json({
      message: "Les indisponibilités ont été créés avec succès.",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        error.message ||
        "Une erreur s'est produite lors de la création des indisponibilités.",
    });
  }
};

exports.getAll = (req, res) => {
  Indisponibilite.findAll({
    order: [["date_ind", "DESC"]],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des indisponibilités.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Indisponibilite.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucun indisponibilité n'a été trouvé.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de l'indisponibilité.",
      });
    });
};

exports.updateOne = (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Update one row.',
      schema: { $ref: '#/definitions/objectSchema' }
    } 
  */
  const id = req.params.id;
  const _indisponibilite = req.body;

  Indisponibilite.update(_indisponibilite, {
    where: { id_indisponibilite: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "L'indisponibilité a été modifié avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun indisponibilité trouvé.",
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Une erreur s'est produite lors de la modification.",
      });
    });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Indisponibilite.destroy({
    where: { id_indisponibilite: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "L'indisponibilité a été supprimé avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun indisponibilité n'a été supprimé.",
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Une erreur s'est produite lors de la suppression.",
      });
    });
};

exports.deleteMany = (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Delete multiple row.',
      schema: { $ref: '#/definitions/arrayOfStrings' }
    } 
  */
  const ids = req.body;

  Indisponibilite.destroy({
    where: { id_indisponibilite: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucun indisponibilite n'a été supprimé.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "L'indisponibilite a été supprimé avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} indisponibilites ont été supprimés avec succès.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Une erreur s'est produite lors de la suppression.",
      });
    });
};
