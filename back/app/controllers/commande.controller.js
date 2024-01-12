const db = require("../models");
const {
  isDateBefore,
  getDateNow,
  getWeekDays,
  countOccurrencesChar,
  getAllDatesInMonth,
} = require("../utils");
const Commande = db.commande;
const Menu = db.menu;
const Plat = db.plat;
const Utilisateur = db.utilisateur;
const Indisponibilite = db.indisponibilite;
const Adorer = db.adorer;
const Preferer = db.preferer;
const Ingredient = db.ingredient;
const Categorie = db.categorie;
const Op = db.Sequelize.Op;

exports.createOne = async (req, res) => {
  const matricule = req.params.matricule ? req.params.matricule : req.matricule;
  const _commande = req.body;
  const now = new Date();
  if (
    !(_commande.etat_commande && _commande.date_menu && _commande.code_commande)
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const menu = await Menu.findOne({
      where: { date_menu: _commande.date_menu },
    });
    if (!menu) {
      res.status(400).json({ message: "Mauvaise demande." });
      return;
    }
    // Récupérer les indisponibilités
    const indisponibilites = await Indisponibilite.findAll({
      where: {
        matricule_utilisateur: {
          [Op.or]: [matricule, null],
        },
        date_ind: menu.date_menu,
      },
    });

    if (
      indisponibilites.length > 0 ||
      isDateBefore(menu.date_limite, now.toISOString())
    ) {
      res.status(400).json({
        message: `Vous ne pouvez pas faire de commande pour ce menu.`,
      });
      return;
    }

    const existingCommande = await Commande.findOne({
      where: {
        id_menu: menu.id_menu,
        matricule_utilisateur: matricule,
      },
    });

    if (existingCommande) {
      res
        .status(400)
        .json({ message: `Une commande existe déjà pour ce menu.` });
      return;
    }

    const data = await Commande.create({
      code_commande: _commande.code_commande,
      etat_commande: _commande.etat_commande,
      id_menu: menu.id_menu,
      matricule_utilisateur: matricule,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la création de la commande.",
    });
  }
};

exports.defaultChoicesForMenu = async (req, res) => {
  const id_menu = req.params.id;
  if (!id_menu) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    // Récupération du menu
    const menu = await Menu.findByPk(id_menu, {
      include: [
        {
          model: Plat,
          as: "plats",
          required: false,
          attributes: ["id_plat", "id_categorie"],
          through: {
            attributes: ["code_menu"],
          },
          include: [
            {
              model: Ingredient,
              as: "ingredients",
              required: false,
              through: {
                attributes: [],
              },
            },
          ],
        },
        {
          model: Commande,
          as: "commandes",
          attributes: ["id_commande", "matricule_utilisateur"],
          required: false,
        },
      ],
    });

    // Récupération des categories
    const categorieOptions = await Categorie.findAll();

    // Liste des plats par Categories
    const listePlatParCategorie = categorieOptions.reduce((acc, cat) => {
      acc[cat.id_categorie] = menu.plats.filter(
        (p) => p.id_categorie == cat.id_categorie
      );
      return acc;
    }, {});
    // Récupération des indisponibilités
    const indisponibilites = await Indisponibilite.findAll({
      attributes: ["matricule_utilisateur"],
      where: {
        date_ind: menu.date_menu,
      },
    });

    // Utilisateurs indisponible
    const utilisateurIndisponible = indisponibilites.map(
      (i) => i.matricule_utilisateur
    );

    // Utilisateurs ayant fait une commande
    const utilisateurAyantUneCommande = menu.commandes.map(
      (c) => c.matricule_utilisateur
    );

    // Utilisateurs à exclure
    const utilisateurExclut = [
      ...utilisateurIndisponible,
      ...utilisateurAyantUneCommande,
    ];

    // Utilisateurs autorisés
    const utilisateurAutorise = await Utilisateur.findAll({
      attributes: ["matricule_utilisateur"],
      where: {
        matricule_utilisateur: {
          [Op.notIn]: utilisateurExclut,
        },
        role_utilisateur: {
          [Op.notIn]: ["extra", "cantine"],
        },
      },
    });

    utilisateurAutorise.forEach(async (u) => {
      const code = [];

      const platAime = await Adorer.findAll({
        attributes: ["id_plat"],
        where: { matricule_utilisateur: u.matricule_utilisateur },
      });
      const idsPlatAime = platAime.map((p) => p.id_plat);
      const preferences = await Preferer.findAll({
        where: {
          matricule_utilisateur: u.matricule_utilisateur,
        },
      });
      const preference_restrictionArr = preferences.reduce(
        (acc, pref) => {
          if (pref.preference_restriction) {
            acc.preferences.push(pref.id_ingredient);
          } else {
            acc.restrictions.push(pref.id_ingredient);
          }
          return acc;
        },
        { preferences: [], restrictions: [] }
      );

      for (const key in listePlatParCategorie) {
        const _platAimeDansLaCategorie = listePlatParCategorie[key].find((p) =>
          idsPlatAime.includes(p.id_plat)
        );
        if (_platAimeDansLaCategorie) {
          code.push(_platAimeDansLaCategorie.present.code_menu);
          continue;
        }

        const platsNonRestreint = listePlatParCategorie[key].filter((plat) => {
          // Vérifie si aucun des ingrédients du plat n'est dans les restrictions
          const platIngredients = plat.ingredients.map(
            (ingredient) => ingredient.id_ingredient
          );
          return !platIngredients.some((ingredientId) =>
            preference_restrictionArr.restrictions.includes(ingredientId)
          );
        });

        if (platsNonRestreint.length > 0) {
          const platPreferer = platsNonRestreint.find((plat) => {
            const platIngredients = plat.ingredients.map(
              (ingredient) => ingredient.id_ingredient
            );
            return platIngredients.some((ingredientId) =>
              preference_restrictionArr.preferences.includes(ingredientId)
            );
          });

          code.push(
            platPreferer
              ? platPreferer.present.code_menu
              : platsNonRestreint[0].present.code_menu
          );
        }
      }

      await Commande.create({
        code_commande: code.join(""),
        etat_commande: "commandée",
        id_menu: menu.id_menu,
        matricule_utilisateur: u.matricule_utilisateur,
      });
    });

    res.status(201).json({ message: "Choix par défaut générés." });
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la création de la commande.",
    });
  }
};

exports.getAll = (req, res) => {
  Commande.findAll({
    include: [
      {
        model: Menu,
        as: "menu",
        required: false,
      },
      {
        model: Utilisateur,
        as: "utilisateur",
        required: false,
      },
    ],
    order: [["date_commande", "DESC"]],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message ||
          "Une erreur s'est produite lors de la recupération des commandes.",
      });
    });
};

exports.getAllCommandesOfTheDayAPI = async (req, res) => {
  const now = getDateNow();

  try {
    const menu = await Menu.findOne({
      attributes: ["id_menu"],
      where: { date_menu: now },
    });
    if (!menu) {
      return;
    }

    const commandesOfTheDay = await Commande.findAll({
      where: { id_menu: menu.id_menu },
      order: [["matricule_utilisateur", "ASC"]],
    });

    res.status(200).json(commandesOfTheDay);
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la recupération des commandes.",
    });
  }
};

exports.getCommandListForWeeklyReport = async (req, res) => {
  const { date } = req.params;
  if (!date) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  try {
    const weekDays = getWeekDays(date);
    const codesForWeek = {};

    // Liste des utilisateurs
    const utilisateurList = await Utilisateur.findAll({
      attributes: [
        "matricule_utilisateur",
        "nom_utilisateur",
        "prenom_utilisateur",
      ],
      where: {
        role_utilisateur: {
          [Op.notIn]: ["extra", "cantine"],
        },
      },
    });

    // Liste des indisponibilités
    const indisponibilitesList = await Indisponibilite.findAll({
      where: {
        date_ind: {
          [Op.between]: [weekDays[0], weekDays[4]],
        },
      },
    });

    // Récupérer les données du menu pour la semaine
    const menu = await Menu.findAll({
      where: {
        date_menu: {
          [Op.between]: [weekDays[0], weekDays[4]],
        },
      },
      include: [
        {
          model: Commande,
          as: "commandes",
          required: false,
        },
      ],
    });

    // Liste des menus de la semaine
    const weekMenuList = weekDays.map((day) => {
      const menuForDay = menu.find((m) => m.date_menu === day);
      if (menuForDay) {
        codesForWeek[day] = menuForDay.commandes.reduce((acc, com) => {
          return com.etat_commande != "annulée" ? acc + com.code_commande : acc;
        }, "");
        return { ...menuForDay.toJSON() };
      } else {
        codesForWeek[day] = "";
        return { date_menu: day };
      }
    });

    // Fonction pour vérifier si un utilisateur a une indisponibilité pour un menu donné
    const hasIndisponibilite = (utilisateur, dateMenu) => {
      const indisponibiliteUtilisateur = indisponibilitesList.find(
        (indispo) =>
          indispo.matricule_utilisateur === utilisateur.matricule_utilisateur &&
          indispo.date_ind === dateMenu
      );

      return !!indisponibiliteUtilisateur;
    };

    // Fonction pour récupérer le code de commande d'un utilisateur pour un menu donné
    const getCodeCommande = (utilisateur, menu) => {
      const commandeUtilisateur = menu.commandes.find(
        (commande) =>
          commande.matricule_utilisateur === utilisateur.matricule_utilisateur
      );

      if (commandeUtilisateur) {
        if (commandeUtilisateur.etat_commande != "annulée") {
          return commandeUtilisateur.code_commande;
        } else {
          return "XXX";
        }
      } else {
        return "";
      }
    };

    // Construire les données des utilisateurs avec les codes de commande ou les cases cochées
    const data = utilisateurList.map((utilisateur) => {
      const userRow = {
        matricule_utilisateur: utilisateur.matricule_utilisateur,
        nom_prenom_utilisateur: `${utilisateur.nom_utilisateur} ${utilisateur.prenom_utilisateur}`,
      };

      // Ajouter les codes de commande ou les cases cochées pour chaque jour de la semaine
      weekMenuList.forEach((menu) => {
        const dateMenu = menu.date_menu;
        if (!menu.commandes) {
          // Si le menu n'existe pas
          userRow[dateMenu] = "X";
        } else {
          userRow[dateMenu] = hasIndisponibilite(utilisateur, dateMenu)
            ? "X"
            : getCodeCommande(utilisateur, menu);
        }
      });

      return userRow;
    });

    const code = {};
    Object.keys(codesForWeek).forEach((day) => {
      const values = codesForWeek[day];
      code[day] = countOccurrencesChar(values);
    });

    res.status(200).json({ weekDays: weekDays, code: code, data: data });
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la recupération des commandes.",
    });
  }
};

exports.getCommandCountForMonthlyReport = async (req, res) => {
  const { date } = req.params;
  if (!date) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }
  try {
    const monthDates = getAllDatesInMonth(date);

    // Récupérez les matricules des extra
    const extra = await Utilisateur.findAll({
      attributes: ["matricule_utilisateur"],
      where: {
        role_utilisateur: "extra",
      },
    });
    const matriculeExtra = extra.map((e) => e.matricule_utilisateur);

    // Récupérez tous les menus entre deux dates
    const menus = await Menu.findAll({
      attributes: ["id_menu", "date_menu"],
      where: {
        date_menu: {
          [Op.between]: [monthDates[0], monthDates[monthDates.length - 1]],
        },
      },
      include: [
        {
          model: Commande,
          as: "commandes",
          required: false,
          attributes: ["id_commande", "etat_commande", "matricule_utilisateur"],
          where: {
            etat_commande: {
              [Op.or]: ["livrée", "non prise"],
            },
          },
        },
      ],
    });

    // Récupérez les données pour chaque menu
    const results = monthDates.map((date) => {
      const menu = menus.find((m) => m.date_menu == date);

      if (!menu) {
        const ell = {
          date_menu: date,
          livreeCount: 0,
          nonPriseCount: 0,
          matriculeCounts: {},
        };
        return ell;
      }

      const count = menu.commandes.reduce(
        (acc, com) => {
          if (com.etat_commande == "non prise") {
            acc.nonPriseCount = acc.nonPriseCount + 1;
          } else if (com.etat_commande == "livrée") {
            if (!matriculeExtra.includes(com.matricule_utilisateur)) {
              acc.livreeCount = acc.livreeCount + 1;
            } else {
              if (acc.matriculeCounts[com.matricule_utilisateur]) {
                acc.matriculeCounts[com.matricule_utilisateur] =
                  acc.matriculeCounts[com.matricule_utilisateur] + 1;
              } else {
                acc.matriculeCounts[com.matricule_utilisateur] = 1;
              }
            }
          }

          return acc;
        },
        { livreeCount: 0, nonPriseCount: 0, matriculeCounts: {} }
      );

      return { date_menu: menu.date_menu, ...count };
    });

    res.status(200).json({ monthDates: monthDates, data: results });
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message ||
        "Une erreur s'est produite lors de la recupération des données.",
    });
  }
};

exports.getOne = (req, res) => {
  const id = req.params.id;

  Commande.findByPk(id, {
    include: [
      {
        model: Menu,
        as: "menu",
        required: false,
      },
      {
        model: Utilisateur,
        as: "utilisateur",
        required: false,
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: `Aucune commande n'a été trouvée.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Erreur lors de la recupération de la commande.",
      });
    });
};

exports.updateOneForClient = async (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Update one row.',
      schema: { $ref: '#/definitions/objectSchema' }
    } 
  */
  const id = req.params.id;
  const matricule = req.matricule;
  const _commande = req.body;
  const now = new Date();

  if (!(_commande.id_menu && _commande.code_commande)) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    // Verification de la date limite du menu
    const menu = await Menu.findByPk(_commande.id_menu);
    // Récupérer les indisponibilités
    const indisponibilites = await Indisponibilite.findAll({
      where: {
        matricule_utilisateur: {
          [Op.or]: [matricule, null],
        },
        date_ind: menu.date_menu,
      },
    });

    if (
      indisponibilites.length > 0 ||
      isDateBefore(menu.date_limite, now.toISOString())
    ) {
      res.status(400).json({
        message: `Vous ne pouvez plus faire de modification pour cette commande.`,
      });
      return;
    }

    const num = await Commande.update(_commande, {
      where: { id_commande: id },
    });

    if (num == 1) {
      res.status(200).json({
        message: "La commande a été modifiée avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucune commande n'a été modifiée.",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message || "Une erreur s'est produite lors de la modification.",
    });
  }
};

exports.updateOneForAdmin = async (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Update one row.',
      schema: { $ref: '#/definitions/objectSchema' }
    } 
  */
  const id = req.params.id;
  const _commande = req.body;

  if (!id) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const num = await Commande.update(_commande, {
      where: { id_commande: id },
    });

    if (num == 1) {
      res.status(200).json({
        message: "La commande a été modifiée avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucune commande n'a été modifiée.",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message || "Une erreur s'est produite lors de la modification.",
    });
  }
};

exports.updateAllCommandeComToNPFromDate = async (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Update one row.',
      schema: { $ref: '#/definitions/objectSchema' }
    } 
  */
  const date = req.params.date;

  if (!date) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const menu = await Menu.findOne({
      where: { date_menu: date },
    });
    if (!menu) {
      res.status(400).json({ message: "Mauvaise demande." });
      return;
    }

    const num = await Commande.update(
      { etat_commande: "non prise" },
      {
        where: { id_menu: menu.id_menu, etat_commande: "commandée" },
      }
    );

    if (num >= 1) {
      res.status(200).json({
        message: "Les commandes ont été modifiées avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucune commande n'a été modifiée.",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message || "Une erreur s'est produite lors de la modification.",
    });
  }
};

exports.takingCommandeForClient = async (req, res) => {
  const id = req.params.id;
  const matricule = req.matricule;

  try {
    const commande = await Commande.findByPk(id);
    let _etat = "";

    if (!commande) {
      res.status(404).json({ message: `Aucune commande trouvée.` });
      return;
    }

    if (commande.matricule_utilisateur != matricule) {
      res
        .status(400)
        .json({ message: `Vous ne pouvez pas modifier cette commande.` });
      return;
    }

    if (commande.etat_commande == "commandée") {
      _etat = "non prise";
    } else if (commande.etat_commande == "non prise") {
      _etat = "commandée";
    } else {
      res.status(400).json({ message: `Mauvaise requête.` });
      return;
    }

    const num = await Commande.update(
      { etat_commande: _etat },
      {
        where: { id_commande: commande.id_commande },
      }
    );

    if (num == 1) {
      res.status(200).json({
        message: "La commande a été modifiée avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucune commande n'a été modifiée.",
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message || "Une erreur s'est produite lors de la modification.",
    });
  }
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;

  Commande.destroy({
    where: { id_commande: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "La commande a été supprimée avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucune commande n'a été supprimée.",
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Une erreur s'est produite lors de la suppression.",
      });
    });
};

exports.deleteMany = (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Delete multiple row.',
      schema: { $ref: '#/definitions/arrayOfStrings' }
    } 
  */
  const ids = req.body;

  Commande.destroy({
    where: { id_commande: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucune commande n'a été supprimée.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "La commande a été supprimée avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} commandes ont été supprimées avec succès.`,
        });
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({
        message:
          err.message || "Une erreur s'est produite lors de la suppression.",
      });
    });
};

exports.createForExtra = async (commande) => {
  const now = getDateNow();
  if (!(commande.matricule_utilisateur && commande.etat_commande)) {
    return null;
  }

  try {
    const menu = await Menu.findOne({
      attributes: ["id_menu"],
      where: { date_menu: now },
    });
    if (!menu) {
      return null;
    }

    await Commande.create({
      code_commande: " ",
      etat_commande: commande.etat_commande,
      id_menu: menu.id_menu,
      matricule_utilisateur: commande.matricule_utilisateur,
    });
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

exports.updateCommandeOfTheDay = async (commande) => {
  if (!(commande.id_commande && commande.etat_commande)) {
    return false;
  }

  try {
    await Commande.update(
      { etat_commande: commande.etat_commande },
      {
        where: { id_commande: commande.id_commande },
      }
    );
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

exports.getAllCommandesOfTheDay = async () => {
  const now = getDateNow();

  try {
    const menu = await Menu.findOne({
      attributes: ["id_menu"],
      where: { date_menu: now },
    });
    if (!menu) {
      return null;
    }

    const commandesOfTheDay = await Commande.findAll({
      where: { id_menu: menu.id_menu },
      order: [["matricule_utilisateur", "ASC"]],
    });

    return commandesOfTheDay;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};
