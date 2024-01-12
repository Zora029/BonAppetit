module.exports = (sequelize, Sequelize) => {
  const Ingredient = sequelize.define(
    "ingredient",
    {
      id_ingredient: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      nom_ingredient: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "ingredients",
      underscored: true,
      timestamps: false,
    }
  );

  return Ingredient;
};
