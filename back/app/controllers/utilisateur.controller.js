const db = require("../models");
const Utilisateur = db.utilisateur;
const Adorer = db.adorer;
const Preferer = db.preferer;
const Ingredient = db.ingredient;
const bcrypt = require("bcryptjs");

exports.createOne = (req, res) => {
  const _utilisateur = req.body;
  if (
    !(
      _utilisateur.matricule_utilisateur &&
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
    profil_utilisateur: req.file
      ? fs.readFileSync(
          __basedir + "/resources/static/assets/uploads/" + req.file.filename
        )
      : null,
  })
    .then((utilisateur) => {
      res.status(200).json({ message: "Utilisateur créé" });
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de l'utilisateur.",
      });
    });
};

exports.getAllIds = (req, res) => {
  Utilisateur.findAll({
    order: [["matricule_utilisateur", "ASC"]],
    attributes: ["matricule_utilisateur"],
  })
    .then((data) => {
      const result = data.map((u) => u.matricule_utilisateur);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des utilisateurs.",
      });
    });
};

exports.getAllIdsByRole = (req, res) => {
  const role = req.params.role;
  Utilisateur.findAll({
    order: [["matricule_utilisateur", "ASC"]],
    attributes: ["matricule_utilisateur"],
    where: { role_utilisateur: role },
  })
    .then((data) => {
      const result = data.map((u) => u.matricule_utilisateur);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des matricules utilisateurs.",
      });
    });
};

exports.getAll = (req, res) => {
  Utilisateur.findAll({
    order: [["matricule_utilisateur", "ASC"]],
    attributes: { exclude: ["mot_de_passe"] },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des utilisateurs.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Utilisateur.findByPk(id, {
    attributes: { exclude: ["mot_de_passe"] },
  })
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucun utilisateur n'a été trouvé.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de l'utilisateur.",
      });
    });
};

exports.getPersonalInformation = (req, res) => {
  const id = req.matricule;

  Utilisateur.findByPk(id, {
    attributes: { exclude: ["mot_de_passe"] },
  })
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucun utilisateur n'a été trouvé.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de l'utilisateur.",
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
  const _utilisateur = req.body;
  if (_utilisateur.mot_de_passe) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  Utilisateur.update(_utilisateur, {
    where: { matricule_utilisateur: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "L'utilisateur a été modifié avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun utilisateur trouvé.",
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

  Utilisateur.destroy({
    where: { matricule_utilisateur: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "L'utilisateur a été supprimé avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun utilisateur n'a été supprimé.",
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

  Utilisateur.destroy({
    where: { matricule_utilisateur: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucun utilisateur n'a été supprimé.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "L'utilisateur a été supprimé avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} utilisateurs ont été supprimés avec succès.`,
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

exports.adorerPlat = async (req, res) => {
  const id_plat = req.params.id;
  const matricule_utilisateur = req.matricule;

  try {
    const existingAdoration = await Adorer.findOne({
      where: {
        matricule_utilisateur,
        id_plat,
      },
    });

    if (existingAdoration) {
      await existingAdoration.destroy();
      res.status(200).json({ message: "Succès." });
    } else {
      await Adorer.create({
        matricule_utilisateur,
        id_plat,
      });
      res.status(200).json({ message: "Succès." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur au niveau du serveur." });
  }
};

exports.getPreferences = async (req, res) => {
  const matricule = req.params.id ? req.params.id : req.matricule;

  try {
    const preferences = await Preferer.findAll({
      where: {
        matricule_utilisateur: matricule,
      },
      include: [
        {
          model: Ingredient,
          as: "ingredient",
        },
      ],
    });

    const preference_restrictionArr = preferences.reduce(
      (acc, pref) => {
        if (pref.preference_restriction) {
          acc.preferences.push(pref.ingredient);
        } else {
          acc.restrictions.push(pref.ingredient);
        }
        return acc;
      },
      { preferences: [], restrictions: [] }
    );

    res
      .status(200)
      .json({ ...preference_restrictionArr, matricule_utilisateur: matricule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur au niveau du serveur." });
  }
};

exports.updatePreferences = async (req, res) => {
  const matricule = req.params.id ? req.params.id : req.matricule;
  const { preferences, restrictions } = req.body;

  try {
    await Preferer.destroy({
      where: {
        matricule_utilisateur: matricule,
      },
    });

    const preferencesArr = preferences.map((pref) => ({
      matricule_utilisateur: matricule,
      id_ingredient: pref.id_ingredient,
      preference_restriction: true,
    }));

    const restrictionsArr = restrictions.map((restriction) => ({
      matricule_utilisateur: matricule,
      id_ingredient: restriction.id_ingredient,
      preference_restriction: false,
    }));

    // Utilisez bulkCreate pour ajouter toutes les nouvelles préférences et restrictions
    await Preferer.bulkCreate([...preferencesArr, ...restrictionsArr]);

    res.status(200).json({ message: "Préférences modifiées." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur au niveau du serveur." });
  }
};
