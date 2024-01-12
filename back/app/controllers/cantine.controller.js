const db = require("../models");
const { isDateBefore } = require("../utils");
const Cantine = db.cantine;

exports.createOne = async (req, res) => {
  const _cantine = req.body;
  if (
    !(
      _cantine.nom_cantine &&
      _cantine.debut_contrat &&
      _cantine.fin_contrat &&
      _cantine.type_contrat &&
      _cantine.nombre_repas &&
      _cantine.matricule_utilisateur &&
      isDateBefore(_cantine.debut_contrat, _cantine.fin_contrat)
    )
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  try {
    if (_cantine.actif) {
      await Cantine.update(
        { actif: false },
        {
          where: {
            actif: true,
          },
        }
      );
    }
    const data = await Cantine.create(_cantine);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la création de la cantine.",
    });
  }
};

exports.getAll = (req, res) => {
  Cantine.findAll({
    order: [["created_at", "DESC"]],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des cantines.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Cantine.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucune cantine n'a été trouvée.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message: err.message || "Erreur lors de la recupération de la cantine.",
      });
    });
};

exports.updateOne = async (req, res) => {
  const id = req.params.id;
  const _cantine = req.body;

  if (
    _cantine.debut_contrat &&
    _cantine.fin_contrat &&
    !isDateBefore(_cantine.debut_contrat, _cantine.fin_contrat)
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    if (_cantine.actif === true) {
      await Cantine.update(
        { actif: false },
        {
          where: {
            actif: true,
          },
        }
      );
    } else {
      if (_cantine.actif === false) {
        const cantine = await Cantine.findByPk(id);
        if (cantine.actif) {
          res
            .status(400)
            .json({ message: "Une cantine active ne peut être désactivée." });
          return;
        }
      }
    }

    const num = await Cantine.update(_cantine, {
      where: { id_cantine: id },
    });

    if (num == 1) {
      res.status(200).json({
        message: "La cantine a été modifiée avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucune cantine trouvée.",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message || "Une erreur s'est produite lors de la modification.",
    });
  }
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Cantine.findByPk(id)
    .then((data) => {
      if (data.actif) {
        res.status(400).json({ message: "Mauvaise demande." });
        return;
      } else {
        Cantine.destroy({
          where: { id_cantine: id },
        })
          .then((num) => {
            if (num == 1) {
              res.status(200).json({
                message: "La cantine a été supprimée avec succès.",
              });
            } else {
              res.status(404).json({
                message: "Aucune cantine n'a été supprimée.",
              });
            }
          })
          .catch((err) => {
            res.status(err.status || 500).json({
              message:
                err.message ||
                "Une erreur s'est produite lors de la suppression.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message: err.message || "Erreur lors de la recupération de la cantine.",
      });
    });
};

exports.deleteMany = async (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Delete multiple row.',
      schema: { $ref: '#/definitions/arrayOfStrings' }
    } 
  */
  const ids = req.body;

  const cantine = await Cantine.findOne({
    where: { actif: true, id_cantine: ids },
  });

  if (cantine) {
    res
      .status(400)
      .json({ message: "Une cantine active ne peut être supprimée." });
    return;
  } else {
    Cantine.destroy({
      where: { id_cantine: ids },
    })
      .then((num) => {
        if (num < 1) {
          res.status(404).json({
            message: "Aucune cantine n'a été supprimée.",
          });
        } else if (num == 1) {
          res.status(200).json({
            message: "La cantine a été supprimée avec succès.",
          });
        } else {
          res.status(200).json({
            message: `Les ${num} cantines ont été supprimées avec succès.`,
          });
        }
      })
      .catch((err) => {
        res.status(err.status || 500).json({
          message:
            err.message || "Une erreur s'est produite lors de la suppression.",
        });
      });
  }
};
