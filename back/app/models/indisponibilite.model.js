module.exports = (sequelize, Sequelize) => {
  const Indisponibilite = sequelize.define(
    "indisponibilite",
    {
      id_indisponibilite: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      date_ind: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: "indisponibilites",
      underscored: true,
      timestamps: false,
    }
  );

  return Indisponibilite;
};
