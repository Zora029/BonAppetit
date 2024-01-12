const db = require("../models");
const Categorie = db.categorie;

exports.createOne = (req, res) => {
  const _categorie = req.body;
  if (!(_categorie.nom_categorie && _categorie.limite_categorie)) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  Categorie.create(_categorie)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de la catégorie.",
      });
    });
};

exports.getAll = (req, res) => {
  Categorie.findAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des catégories.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Categorie.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucune catégorie n'a été trouvée.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de la catégorie.",
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
  const _categorie = req.body;

  Categorie.update(_categorie, {
    where: { id_categorie: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "La catégorie a été modifiée avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucune catégorie trouvée.",
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

  Categorie.destroy({
    where: { id_categorie: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "La catégorie a été supprimée avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucune catégorie n'a été supprimée.",
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

  Categorie.destroy({
    where: { id_categorie: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucune catégorie n'a été supprimée.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "La catégorie a été supprimée avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} categories ont été supprimées avec succès.`,
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
