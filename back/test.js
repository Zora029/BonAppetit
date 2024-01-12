const db = require("../models");

const getPlatsForUtilisateur = async (id_utilisateur) => {
  try {
    const plats = await db.plat.findAll({
      attributes: [
        "id_plat",
        "nom_plat",
        "description_plat",
        "visuel_plat",
        "id_categorie",
        // Ajoutez d'autres attributs de plat que vous souhaitez récupérer
        [
          // Utilisez une sous-requête pour vérifier si la liaison existe
          db.sequelize.literal(
            `(SELECT COUNT(*) FROM adore WHERE adore.id_plat = plat.id_plat AND adore.matricule_utilisateur = ${id_utilisateur}) > 0`
          ),
          "isAdorer",
        ],
      ],
      include: [
        {
          model: db.utilisateur,
          as: "utilisateurs",
          attributes: [], // Ne récupère pas d'attributs de la table utilisateur
          where: {
            matricule_utilisateur: id_utilisateur,
          },
          required: false, // LEFT JOIN pour inclure tous les plats même s'ils n'ont pas de liaison avec l'utilisateur
        },
      ],
    });

    return plats;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching plats for utilisateur");
  }
};

// Exemple d'utilisation
const id_utilisateur = "123"; // Remplacez cela par l'id_utilisateur réel
getPlatsForUtilisateur(id_utilisateur)
  .then((plats) => {
    console.log(plats);
  })
  .catch((error) => {
    console.error(error);
  });
