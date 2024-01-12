module.exports = (sequelize, Sequelize) => {
  const Commande = sequelize.define(
    "commande",
    {
      id_commande: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      etat_commande: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      code_commande: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "commandes",
      updatedAt: "date_commande",
      underscored: true,
    }
  );

  return Commande;
};
