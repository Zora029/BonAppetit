const db = require("../models");
const Ingredient = db.ingredient;

exports.createOne = (req, res) => {
  const _ingredient = req.body;
  if (!_ingredient.nom_ingredient) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  Ingredient.create(_ingredient)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de l'ingrédient.",
      });
    });
};

exports.getAll = (req, res) => {
  Ingredient.findAll({
    order: [["nom_ingredient", "ASC"]],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des ingrédients.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Ingredient.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucun ingrédient n'a été trouvé.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de l'ingrédient.",
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
  const _ingredient = req.body;

  Ingredient.update(_ingredient, {
    where: { id_ingredient: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "L'ingrédient a été modifié avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun ingrédient trouvé.",
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

  Ingredient.destroy({
    where: { id_ingredient: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "L'ingrédient a été supprimé avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun ingrédient n'a été supprimé.",
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

  Ingredient.destroy({
    where: { id_ingredient: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucun ingredient n'a été supprimé.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "L'ingredient a été supprimé avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} ingredients ont été supprimés avec succès.`,
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
