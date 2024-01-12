const {
  createForExtra,
  getAllCommandesOfTheDay,
  updateCommandeOfTheDay,
} = require("./app/controllers/commande.controller");

const socketManager = (io) => {
  io.on("connection", (socket) => {
    console.log("Nouvelle connexion Socket.IO");

    socket.on("extraPointage", (commande) => {
      createForExtra(commande).then(() => {
        getAllCommandesOfTheDay().then((data) => {
          if (data) {
            io.emit("reloadCommandesOfTheDay", data);
          }
        });
      });
    });

    socket.on("updateCommandeOfTheDay", (commande) => {
      updateCommandeOfTheDay(commande).then((isModified) => {
        if (isModified) {
          getAllCommandesOfTheDay().then((data) => {
            if (data) {
              io.emit("reloadCommandesOfTheDay", data);
            }
          });
        }
      });
    });
  });
};

module.exports = socketManager;
