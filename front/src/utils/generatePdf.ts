import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface IlisteCommandesData {
  weekDays: string[];
  code: { [weekDay: string]: string };
  data: { [key: string]: string }[];
}

interface IrapportMensuelData {
  monthDates: string[];
  data: {
    date_menu: string;
    livreeCount: number;
    nonPriseCount: number;
    matriculeCounts: { [key: string]: number };
  }[];
}

export const listeCommandesPdf = ({
  weekDays,
  code,
  data,
}: IlisteCommandesData) => {
  const pdf = new jsPDF('p', 'pt', 'letter');

  pdf.text(`Liste des commandes du ${weekDays[0]} au ${weekDays[4]}`, 140, 50);
  pdf.setLineWidth(2);

  // Les colonnes du tableau
  const columns = [
    { header: 'Matricule', dataKey: 'matricule_utilisateur' },
    { header: 'Nom & Prenom', dataKey: 'nom_prenom_utilisateur' },
    { header: 'Lundi', dataKey: weekDays[0] },
    { header: 'Mardi', dataKey: weekDays[1] },
    { header: 'Mercredi', dataKey: weekDays[2] },
    { header: 'Jeudi', dataKey: weekDays[3] },
    { header: 'Vendredi', dataKey: weekDays[4] },
  ];

  // Ajoutez le tableau au PDF
  autoTable(pdf, {
    columns: columns,
    columnStyles: {
      matricule_utilisateur: { cellWidth: 60 },
      [weekDays[0]]: { halign: 'center', cellWidth: 60 },
      [weekDays[1]]: { halign: 'center', cellWidth: 60 },
      [weekDays[2]]: { halign: 'center', cellWidth: 60 },
      [weekDays[3]]: { halign: 'center', cellWidth: 60 },
      [weekDays[4]]: { halign: 'center', cellWidth: 60 },
    },
    body: data,
    startY: 70,
    theme: 'grid',
  });

  pdf.addPage();

  // Ajoutez le tableau des occurrences des caractères pour chaque propriété
  pdf.text(`Nombre de Choix du ${weekDays[0]} au ${weekDays[4]}`, 140, 50);

  // Construisez les données du tableau
  const uniqueChars = [
    ...new Set(Object.values(code).flatMap((day) => Object.keys(day))),
  ];

  const tableData = uniqueChars.map((char) => {
    const row = [char];
    Object.keys(code).forEach((day) => {
      row.push(code[day][char as keyof (typeof code)[0]]?.toString() || '0');
    });
    return row;
  });

  console.log({ code, uniqueChars, tableData });

  // Ajoutez le tableau au PDF
  autoTable(pdf, {
    head: [['Code', ...Object.keys(code)]],
    body: tableData,
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    },
    startY: 70,
    theme: 'grid',
  });

  // Téléchargez le PDF
  pdf.save(`liste_commandes_hebdomadaire`);
};

export const rapportMensuelPdf = ({
  monthDates,
  data,
}: IrapportMensuelData) => {
  const pdf = new jsPDF('p', 'pt', 'letter');

  console.log({ monthDates, data });

  pdf.text(
    `Rapport du ${monthDates[0]} au ${monthDates[monthDates.length - 1]}`,
    140,
    50,
  );
  pdf.setLineWidth(2);

  // Donnée du tableau
  const _data = data.map((el) => {
    let totalSuppl = 0;
    let observationSuppl = '';
    let total = 0;

    for (const key in el.matriculeCounts) {
      totalSuppl = totalSuppl + el.matriculeCounts[key];
      if (observationSuppl) {
        observationSuppl =
          observationSuppl + `+ ${el.matriculeCounts[key]}${key} `;
      } else {
        observationSuppl =
          observationSuppl + `${el.matriculeCounts[key]}${key} `;
      }
    }
    total = el.livreeCount ? el.livreeCount + totalSuppl : totalSuppl;
    return {
      date: el.date_menu,
      Nb_commande_livree: el.livreeCount,
      totalSuppl: totalSuppl,
      observationSuppl: observationSuppl,
      total: total,
    };
  });

  // Les colonnes du tableau
  const columns = [
    { header: 'Date', dataKey: 'date' },
    { header: 'Nb_commande_livree', dataKey: 'Nb_commande_livree' },
    { header: 'Suppl', dataKey: 'totalSuppl' },
    { header: 'Observation Suppléments', dataKey: 'observationSuppl' },
    { header: 'Total', dataKey: 'total' },
  ];

  // Ajoutez le tableau au PDF
  autoTable(pdf, {
    columns: columns,
    columnStyles: {
      date: { cellWidth: 60 },
      Nb_commande_livree: { halign: 'center' },
      totalSuppl: { halign: 'center', cellWidth: 60 },
      total: { halign: 'center', cellWidth: 60 },
    },
    body: _data,
    startY: 70,
    theme: 'grid',
  });

  // Téléchargez le PDF
  pdf.save(`rapport_mensuel`);
};
