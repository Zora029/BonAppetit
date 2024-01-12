module.exports = (sequelize, Sequelize) => {
  const Plat = sequelize.define(
    "plat",
    {
      id_plat: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      nom_plat: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description_plat: {
        type: Sequelize.TEXT,
      },
      visuel_plat: {
        type: Sequelize.BLOB("medium"),
      },
    },
    {
      tableName: "plats",
      underscored: true,
    }
  );

  return Plat;
};
