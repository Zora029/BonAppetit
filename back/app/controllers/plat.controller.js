const fs = require("fs");
const db = require("../models");
const Plat = db.plat;
const Ingredient = db.ingredient;
const Categorie = db.categorie;
const Cantine = db.cantine;
const Contenir = db.contenir;

exports.createOne = async (req, res) => {
  const { ingredients, ..._plat } = req.body;
  const _ingredients = JSON.parse(ingredients);
  if (!(_plat.nom_plat && _plat.id_cantine && _plat.id_categorie)) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const plat = await Plat.create({
      ..._plat,
      visuel_plat: req.file
        ? fs.readFileSync(
            __basedir + "/resources/static/assets/uploads/" + req.file.filename
          )
        : null,
    });

    if (Array.isArray(_ingredients) && _ingredients.length) {
      const contenirArr = _ingredients.map((ing) => ({
        id_ingredient: ing.id_ingredient,
        id_plat: plat.id_plat,
      }));
      await Contenir.bulkCreate(contenirArr);
    }

    res.status(201).json({ id_plat: plat.id_plat });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création du plat.",
    });
  }
};

exports.getAll = (req, res) => {
  Plat.findAll({
    order: [["updated_at", "DESC"]],
    include: [
      {
        model: Ingredient,
        as: "ingredients",
        required: false,
        through: {
          attributes: [],
        },
      },
      {
        model: Categorie,
        as: "categorie",
        required: false,
      },
      {
        model: Cantine,
        as: "cantine",
        required: false,
      },
    ],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des plats.",
      });
    });
};

exports.getAllWithAdorer = (req, res) => {
  const matricule = req.matricule;

  Plat.findAll({
    order: [["updated_at", "DESC"]],
    attributes: {
      include: [
        [
          db.sequelize.literal(
            `(SELECT COUNT(*) FROM adorer WHERE adorer.id_plat = plat.id_plat AND adorer.matricule_utilisateur = '${matricule}') > 0`
          ),
          "isAdorer",
        ],
      ],
    },
    include: [
      {
        model: Ingredient,
        as: "ingredients",
        required: false,
        through: {
          attributes: [],
        },
      },
      {
        model: Categorie,
        as: "categorie",
        required: false,
      },
      {
        model: Cantine,
        as: "cantine",
        required: false,
      },
    ],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des plats.",
      });
    });
};

exports.getAllPlatMenuOptions = async (req, res) => {
  try {
    const cantine = await Cantine.findOne({
      where: { actif: true },
    });

    const plats = await Plat.findAll({
      where: { id_cantine: cantine.id_cantine },
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          required: false,
          through: {
            attributes: [],
          },
        },
        {
          model: Categorie,
          as: "categorie",
          required: false,
        },
        {
          model: Cantine,
          as: "cantine",
          required: false,
        },
      ],
    });

    res.status(200).json(plats);
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la recupération des plats.",
    });
  }
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Plat.findByPk(id, {
    include: [
      {
        model: Ingredient,
        as: "ingredients",
        required: false,
        through: {
          attributes: [],
        },
      },
      {
        model: Categorie,
        as: "categorie",
        required: false,
      },
      {
        model: Cantine,
        as: "cantine",
        required: false,
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucun plat n'a été trouvé.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message: err.message || "Erreur lors de la recupération du plat.",
      });
    });
};

exports.getOneWithAdorer = (req, res) => {
  const id = req.params.id;
  const matricule = req.matricule;

  Plat.findByPk(id, {
    attributes: {
      include: [
        [
          db.sequelize.literal(
            `(SELECT COUNT(*) FROM adorer WHERE adorer.id_plat = plat.id_plat AND adorer.matricule_utilisateur = '${matricule}') > 0`
          ),
          "isAdorer",
        ],
      ],
    },
    include: [
      {
        model: Ingredient,
        as: "ingredients",
        required: false,
        through: {
          attributes: [],
        },
      },
      {
        model: Categorie,
        as: "categorie",
        required: false,
      },
      {
        model: Cantine,
        as: "cantine",
        required: false,
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucun plat n'a été trouvé.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message: err.message || "Erreur lors de la recupération du plat.",
      });
    });
};

exports.updateOne = async (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Update one row.',
      schema: { $ref: '#/definitions/objectSchema' }
    } 
  */
  const id = req.params.id;
  const { ingredients, ..._plat } = req.body;
  const _ingredients = JSON.parse(ingredients);
  try {
    let num = 0;

    if (Array.isArray(_ingredients)) {
      const contenirArr = _ingredients.map((ing) => ({
        id_ingredient: ing.id_ingredient,
        id_plat: id,
      }));

      await Contenir.destroy({
        where: {
          id_plat: id,
        },
      });
      await Contenir.bulkCreate(contenirArr);
      num = num + 1;
    }

    if (req.file) {
      _plat.visuel_plat = fs.readFileSync(
        __basedir + "/resources/static/assets/uploads/" + req.file.filename
      );
    }

    num = num + (await Plat.update(_plat, { where: { id_plat: id } }));

    if (num >= 1) {
      res.status(200).json({
        message: "Le plat a été modifié avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucun plat trouvé.",
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

  Plat.destroy({
    where: { id_plat: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "Le plat a été supprimé avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun plat n'a été supprimé.",
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

  Plat.destroy({
    where: { id_plat: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucun plat n'a été supprimé.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "Le plat a été supprimé avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} plats ont été supprimés avec succès.`,
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
