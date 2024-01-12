const db = require("../models");
const Notification = db.notification;

exports.createOne = (req, res) => {
  const _notification = req.body;
  if (
    !(
      _notification.contenu_notification &&
      _notification.lien_notification &&
      _notification.type_notification &&
      _notification.destinataire_notification
    )
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  Notification.create(_notification)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la création de la notification.",
      });
    });
};

exports.getAll = (req, res) => {
  Notification.findAll({
    order: [["date_notification", "DESC"]],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des notifications.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Notification.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: "Aucune notification n'a été trouvée.",
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de la notification.",
      });
    });
};

exports.getPreview = (req, res) => {
  Notification.findAll({
    order: [["date_notification", "DESC"]],
    limite: 5,
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des notifications.",
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
  const _notification = req.body;

  Notification.update(_notification, {
    where: { id_notification: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "La notification a été modifiée avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucune notification trouvée.",
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

  Notification.destroy({
    where: { id_notification: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "La notification a été supprimée avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucune notification n'a été supprimée.",
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

  Notification.destroy({
    where: { id_notification: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucune notification n'a été supprimée.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "La notification a été supprimée avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} notifications ont été supprimées avec succès.`,
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
