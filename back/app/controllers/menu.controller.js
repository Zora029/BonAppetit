const db = require("../models");
const { getWeekDays, getDate, isDateBefore } = require("../utils");
const Op = db.Sequelize.Op;
const Menu = db.menu;
const Commande = db.commande;
const Plat = db.plat;
const Indisponibilite = db.indisponibilite;
const Ingredient = db.ingredient;
const Categorie = db.categorie;
const Cantine = db.cantine;
const Present = db.present;

exports.getWeekMenuForAdmin = async (req, res) => {
  const { date } = req.params;

  try {
    const date_vise = date ? new Date(date) : new Date();

    let dayOfWeek = date_vise.getDay();
    dayOfWeek = dayOfWeek == 0 || dayOfWeek == 6 ? 1 : dayOfWeek;

    const weekDays = getWeekDays(date_vise);

    // Récupérer la cantine actif
    const cantine = await Cantine.findOne({
      where: { actif: true },
    });

    // Récupérer les indisponibilités
    const indisponibilites = await Indisponibilite.findAll({
      where: {
        matricule_utilisateur: null,
        date_ind: {
          [Op.between]: [weekDays[0], weekDays[4]],
        },
      },
    });
    const indArr = indisponibilites.map((ind) => getDate(ind.date_ind));

    // Récupérer les données du menu pour la semaine
    const menu = await Menu.findAll({
      where: {
        date_menu: {
          [Op.between]: [weekDays[0], weekDays[4]],
        },
      },
      include: [
        {
          model: Cantine,
          as: "cantine",
          required: false,
        },
        {
          model: Plat,
          as: "plats",
          required: false,
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
            {
              model: Categorie,
              as: "categorie",
              required: false,
            },
            {
              model: Cantine,
              as: "cantine",
              required: false,
            },
          ],
        },
      ],
    });

    // Créer un tableau de menuData pour chaque jour de la semaine
    const menuDataForWeek = weekDays.map((day) => {
      const menuForDay = menu.find((m) => m.date_menu === day);

      if (menuForDay) {
        return {
          ...menuForDay.toJSON(),
          jour_de_la_semaine: weekDays.indexOf(day) + 1,
          isSelected: weekDays.indexOf(day) + 1 == dayOfWeek,
          commande_possible: !indArr.includes(day),
        };
      } else {
        return {
          id_menu: "",
          date_menu: day,
          date_limite: "",
          jour_de_la_semaine: weekDays.indexOf(day) + 1,
          isSelected: weekDays.indexOf(day) + 1 == dayOfWeek,
          commande_possible: !indArr.includes(day),
          plats: [],
          cantine: cantine,
        };
      }
    });

    return res.status(200).json(menuDataForWeek);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Une erreur s'est produite au niveau du serveur." });
  }
};

exports.getWeekMenuForClient = async (req, res) => {
  const matricule = req.matricule;
  const { date } = req.params;
  const now = new Date();

  try {
    const date_vise = date ? new Date(date) : now;

    let dayOfWeek = date_vise.getDay();
    dayOfWeek = dayOfWeek == 0 || dayOfWeek == 6 ? 1 : dayOfWeek;

    const weekDays = getWeekDays(date_vise);

    // Récupérer la cantine actif
    const cantine = await Cantine.findOne({
      where: { actif: true },
    });

    // Récupérer les indisponibilités
    const indisponibilites = await Indisponibilite.findAll({
      where: {
        matricule_utilisateur: {
          [Op.or]: [matricule, null],
        },
        date_ind: {
          [Op.between]: [weekDays[0], weekDays[4]],
        },
      },
    });
    const indArr = indisponibilites.map((ind) => ind.date_ind);

    // Récupérer les données du menu pour la semaine
    const menu = await Menu.findAll({
      where: {
        date_menu: {
          [Op.between]: [weekDays[0], weekDays[4]],
        },
      },
      include: [
        {
          model: Plat,
          as: "plats",
          required: false,
          attributes: {
            include: [
              [
                db.sequelize.literal(
                  `(SELECT COUNT(*) FROM adorer WHERE adorer.id_plat = plats.id_plat AND adorer.matricule_utilisateur = '${matricule}') > 0`
                ),
                "isAdorer",
              ],
            ],
          },
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
            {
              model: Categorie,
              as: "categorie",
              required: false,
            },
            {
              model: Cantine,
              as: "cantine",
              required: false,
            },
          ],
        },
        {
          model: Commande,
          required: false,
          where: {
            matricule_utilisateur: matricule,
          },
        },
      ],
    });

    // Créer un tableau de menuData pour chaque jour de la semaine
    const menuDataForWeek = weekDays.map((day) => {
      const menuForDay = menu.find((m) => m.date_menu === day);

      if (menuForDay) {
        return {
          ...menuForDay.toJSON(),
          jour_de_la_semaine: weekDays.indexOf(day) + 1,
          isSelected: weekDays.indexOf(day) + 1 == dayOfWeek,
          commande_possible: !(
            indArr.includes(day) &&
            isDateBefore(menuForDay.date_menu, now.toISOString())
          ),
        };
      } else {
        // A modifier
        return {
          id_menu: "",
          date_menu: day,
          date_limite: "",
          jour_de_la_semaine: weekDays.indexOf(day) + 1,
          isSelected: weekDays.indexOf(day) + 1 == dayOfWeek,
          commande_possible: false,
          commandes: [],
          plats: [],
          cantine: cantine,
        };
      }
    });

    return res.status(200).json(menuDataForWeek);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Une erreur s'est produite au niveau du serveur." });
  }
};

exports.getOne = async (req, res) => {
  const id = req.params.id;

  try {
    const menu = await Menu.findByPk(id, {
      include: [
        {
          model: Plat,
          as: "plats",
          required: false,
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
            {
              model: Categorie,
              as: "categorie",
              required: false,
            },
            {
              model: Cantine,
              as: "cantine",
              required: false,
            },
          ],
        },
      ],
    });

    if (menu) {
      const indisponibilite = await Indisponibilite.findOne({
        where: {
          matricule_utilisateur: null,
          date_ind: menu.date_menu,
        },
      });
      const date = new Date(menu.date_menu);
      const day = date.getDay();

      res.status(200).json({
        ...menu.toJSON(),
        commande_possible: indisponibilite == undefined ? true : false,
        jour_de_la_semaine: day,
        isSelected: true,
      });
    } else {
      res.status(404).json({
        message: `Aucun menu n'a été trouvé.`,
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Une erreur s'est produite au niveau du serveur." });
  }
};

exports.getOneWithCommande = async (req, res) => {
  const matricule = req.matricule;
  const id = req.params.id;

  try {
    const menu = await Menu.findByPk(id, {
      include: [
        {
          model: Plat,
          required: false,
          attributes: {
            include: [
              [
                db.sequelize.literal(
                  `(SELECT COUNT(*) FROM adorer WHERE adorer.id_plat = plats.id_plat AND adorer.matricule_utilisateur = '${matricule}') > 0`
                ),
                "isAdorer",
              ],
            ],
          },
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
            {
              model: Categorie,
              as: "categorie",
              required: false,
            },
            {
              model: Cantine,
              as: "cantine",
              required: false,
            },
          ],
        },
        {
          model: Commande,
          required: false,
          where: {
            matricule_utilisateur: matricule,
          },
        },
      ],
    });

    res.status(200).json(menu);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Une erreur s'est produite au niveau du serveur." });
  }
};

exports.createOne = async (req, res) => {
  const _menu = req.body;

  if (
    !(
      _menu.date_menu &&
      _menu.date_limite &&
      _menu.id_cantine &&
      Array.isArray(_menu.plats) &&
      _menu.plats.length
    )
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const existingMenu = await Menu.findOne({
      where: { date_menu: _menu.date_menu },
    });

    if (existingMenu) {
      res
        .status(400)
        .json({ message: `Un menu existe déjà pour ${_menu.date_menu}.` });
      return;
    }

    const menu = await Menu.create({
      date_menu: getDate(_menu.date_menu),
      date_limite: _menu.date_limite,
      id_cantine: _menu.id_cantine,
    });

    const presentArr = _menu.plats.map((plat) => ({
      id_menu: menu.id_menu,
      id_plat: plat.id_plat,
      code_menu: plat.code_menu,
    }));

    await Present.bulkCreate(presentArr);

    res.status(200).json({
      message: "Le menu a été créé avec succès.",
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message:
        err.message || "Une erreur s'est produite lors de la création du menu.",
    });
  }
};

exports.updateOne = async (req, res) => {
  /*  
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Update one row.',
      schema: { $ref: '#/definitions/objectSchema' }
    } 
  */
  const id = req.params.id;
  const { plats, ..._menu } = req.body;

  if (
    !(
      _menu.date_menu &&
      _menu.date_limite &&
      Array.isArray(plats) &&
      plats.length
    )
  ) {
    res.status(400).json({ message: "Mauvaise demande." });
    return;
  }

  try {
    const num = await Menu.update(_menu, {
      where: { id_menu: id },
    });

    if (num == 1) {
      await Present.destroy({
        where: { id_menu: id },
      });

      const presentArr = plats.map((plat) => ({
        id_menu: id,
        id_plat: plat.id_plat,
        code_menu: plat.code_menu,
      }));

      await Present.bulkCreate(presentArr);

      res.status(200).json({
        message: "Le menu a été modifié avec succès.",
      });
    } else {
      res.status(404).json({
        message: "Aucun menu trouvé.",
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

  Menu.destroy({
    where: { id_menu: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).json({
          message: "Le menu a été supprimé avec succès.",
        });
      } else {
        res.status(404).json({
          message: "Aucun menu n'a été supprimé.",
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

  Menu.destroy({
    where: { id_menu: ids },
  })
    .then((num) => {
      if (num < 1) {
        res.status(404).json({
          message: "Aucun menu n'a été supprimé.",
        });
      } else if (num == 1) {
        res.status(200).json({
          message: "Le menu a été supprimé avec succès.",
        });
      } else {
        res.status(200).json({
          message: `Les ${num} menus ont été supprimés avec succès.`,
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
