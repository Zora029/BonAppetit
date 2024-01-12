module.exports = (sequelize, Sequelize) => {
  const Cantine = sequelize.define(
    "cantine",
    {
      id_cantine: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      nom_cantine: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      debut_contrat: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fin_contrat: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      type_contrat: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      nombre_repas: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      actif: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "cantines",
      underscored: true,
    }
  );

  return Cantine;
};
