const jsPDF = require("jspdf");

exports.generateWeekCommandeReport = (data) => {
  // Créez une instance de jsPDF
  const pdf = new jsPDF();

  // Ajoutez le titre du rapport
  pdf.text("Liste des Commandes de la semaine", 14, 20);

  // Ajoutez un saut de page
  pdf.addPage();

  // Définissez les colonnes du tableau
  const columns = [
    "Matricule",
    "Nom et Prénom",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];

  // Ajoutez le tableau des données
  const data = userData.map((user) => [
    user.matricule_utilisateur,
    `${user.nom_utilisateur} ${user.prenom_utilisateur}`,
    user.commands.find((command) => command.jour_menu.toLowerCase() === "lundi")
      ?.code_commande || "",
    user.commands.find((command) => command.jour_menu.toLowerCase() === "mardi")
      ?.code_commande || "",
    user.commands.find(
      (command) => command.jour_menu.toLowerCase() === "mercredi"
    )?.code_commande || "",
    user.commands.find((command) => command.jour_menu.toLowerCase() === "jeudi")
      ?.code_commande || "",
    user.commands.find(
      (command) => command.jour_menu.toLowerCase() === "vendredi"
    )?.code_commande || "",
  ]);

  // Ajoutez le tableau au PDF
  pdf.autoTable({
    head: [columns],
    body: data,
    startY: 30,
  });

  // Téléchargez le PDF
  pdf.save("rapport_commandes.pdf");
};
