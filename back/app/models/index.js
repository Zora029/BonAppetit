const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAlias: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Tables principales

db.utilisateur = require("./utilisateur.model.js")(sequelize, Sequelize);

db.cantine = require("./cantine.model.js")(sequelize, Sequelize);

db.ingredient = require("./ingredient.model.js")(sequelize, Sequelize);

db.categorie = require("./categorie.model.js")(sequelize, Sequelize);

db.plat = require("./plat.model.js")(sequelize, Sequelize);

db.menu = require("./menu.model.js")(sequelize, Sequelize);

db.commande = require("./commande.model.js")(sequelize, Sequelize);

db.notification = require("./notification.model.js")(sequelize, Sequelize);

db.indisponibilite = require("./indisponibilite.model.js")(
  sequelize,
  Sequelize
);

// Model Associations

db.preferer = sequelize.define(
  "preferer",
  {
    preference_restriction: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

db.present = sequelize.define(
  "present",
  {
    code_menu: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

db.avoir = sequelize.define(
  "avoir",
  {
    etat_notification: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

db.adorer = sequelize.define(
  "adorer",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

db.contenir = sequelize.define(
  "contenir",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

db.inclure = sequelize.define(
  "inclure",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Associations

// Un utilisateur peut adorer plusieurs plats et vice-versa
db.utilisateur.belongsToMany(db.plat, {
  through: db.adorer,
  foreignKey: "matricule_utilisateur",
});
db.plat.belongsToMany(db.utilisateur, {
  through: db.adorer,
  foreignKey: "id_plat",
});

// Utilisateur Reagir Ingredient
db.utilisateur.belongsToMany(db.ingredient, {
  through: db.preferer,
  foreignKey: "matricule_utilisateur",
});
db.ingredient.belongsToMany(db.utilisateur, {
  through: db.preferer,
  foreignKey: "id_ingredient",
});
db.preferer.belongsTo(db.ingredient, {
  foreignKey: "id_ingredient",
});

// Plat Contenir Ingredient
db.plat.belongsToMany(db.ingredient, {
  through: db.contenir,
  foreignKey: "id_plat",
});
db.ingredient.belongsToMany(db.plat, {
  through: db.contenir,
  foreignKey: "id_ingredient",
});

// Plat Appartenir à une Categorie
db.plat.belongsTo(db.categorie, {
  foreignKey: "id_categorie",
});
db.categorie.hasMany(db.plat, {
  foreignKey: "id_categorie",
});

// Plat Preparer par une Cantine
db.plat.belongsTo(db.cantine, {
  foreignKey: "id_cantine",
});
db.cantine.hasMany(db.plat, {
  foreignKey: "id_cantine",
});

// Plats Present dans Menu
db.plat.belongsToMany(db.menu, {
  through: db.present,
  foreignKey: "id_plat",
});
db.menu.belongsToMany(db.plat, {
  through: db.present,
  foreignKey: "id_menu",
});

// Menu Proposer par Cantine
db.menu.belongsTo(db.cantine, {
  foreignKey: "id_cantine",
});
db.cantine.hasMany(db.menu, {
  foreignKey: "id_cantine",
});

// Commande suivre un Menu
db.commande.belongsTo(db.menu, {
  foreignKey: "id_menu",
});
db.menu.hasMany(db.commande, {
  foreignKey: "id_menu",
});

// Plats incluts dans des Commandes
db.plat.belongsToMany(db.commande, {
  through: db.inclure,
  foreignKey: "id_plat",
});
db.commande.belongsToMany(db.plat, {
  through: db.inclure,
  foreignKey: "id_commande",
});

// Commandes fait par un Utilisateur
db.commande.belongsTo(db.utilisateur, {
  foreignKey: "matricule_utilisateur",
});
db.utilisateur.hasMany(db.commande, {
  foreignKey: "matricule_utilisateur",
});

// Utilisateurs avoir Notifications
db.utilisateur.belongsToMany(db.notification, {
  through: db.avoir,
  foreignKey: "matricule_utilisateur",
});
db.notification.belongsToMany(db.utilisateur, {
  through: db.avoir,
  foreignKey: "id_notification",
});

// Indisponibilites d'un Utilisateur
db.indisponibilite.belongsTo(db.utilisateur, {
  foreignKey: "matricule_utilisateur",
});
db.utilisateur.hasMany(db.indisponibilite, {
  foreignKey: "matricule_utilisateur",
});

// Une Cantine est gerée par un Utilisateur
db.cantine.belongsTo(db.utilisateur, {
  foreignKey: "matricule_utilisateur",
});
db.utilisateur.hasMany(db.cantine, {
  foreignKey: "matricule_utilisateur",
});

module.exports = db;
