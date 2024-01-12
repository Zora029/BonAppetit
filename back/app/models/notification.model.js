module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "notification",
    {
      id_notification: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      contenu_notification: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lien_notification: {
        type: Sequelize.STRING,
      },
      type_notification: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      destinataire_notification: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "notifications",
      updatedAt: "date_notification",
      underscored: true,
    }
  );

  return Notification;
};
