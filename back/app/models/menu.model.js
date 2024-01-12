module.exports = (sequelize, Sequelize) => {
  const Menu = sequelize.define(
    "menu",
    {
      id_menu: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      date_menu: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true,
      },
      date_limite: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "menus",
      underscored: true,
    }
  );

  return Menu;
};
