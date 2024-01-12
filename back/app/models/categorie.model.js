module.exports = (sequelize, Sequelize) => {
  const Categorie = sequelize.define(
    "categorie",
    {
      id_categorie: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom_categorie: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      limite_categorie: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "categories",
      underscored: true,
      timestamps: false,
    }
  );

  return Categorie;
};
