module.exports = (sequelize, Sequelize) => {
  const Utilisateur = sequelize.define(
    "utilisateur",
    {
      matricule_utilisateur: {
        type: Sequelize.STRING(10),
        primaryKey: true,
      },
      nom_utilisateur: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      prenom_utilisateur: {
        type: Sequelize.STRING(50),
      },
      email_utilisateur: {
        type: Sequelize.STRING(50),
      },
      tel_utilisateur: {
        type: Sequelize.STRING(50),
      },
      mot_de_passe: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      poste_utilisateur: {
        type: Sequelize.STRING(50),
      },
      profil_utilisateur: {
        type: Sequelize.BLOB,
      },
      role_utilisateur: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "utilisateurs",
      underscored: true,
    }
  );

  return Utilisateur;
};
