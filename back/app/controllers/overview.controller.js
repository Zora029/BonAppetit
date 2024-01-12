const db = require("../models");
const Cantine = db.cantine;
const Menu = db.menu;
const Commande = db.commande;

exports.getCantineOverview = (req, res) => {
  Cantine.findAll({
    order: [["created_at", "DESC"]],
    attributes: {
      include: [
        [
          db.sequelize.fn(
            "COUNT",
            db.sequelize.col("menus->commandes.id_commande")
          ),
          "nombre_commande_livree",
        ],
      ],
    },
    include: [
      {
        model: Menu,
        attributes: [],
        include: [
          {
            model: Commande,
            attributes: [],
            where: {
              etat_commande: "livrée",
            },
            required: false,
          },
        ],
        required: false,
      },
    ],
    group: ["cantine.id_cantine"],
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
