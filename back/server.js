const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { Server } = require("socket.io");

const index = require("./app/routes");
const db = require("./app/models");
const swaggerOutput = require("./swagger_output.json");
const socketManager = require("./socket.manager");

global.__basedir = __dirname;

let corsOptions = {
  origin: "http://localhost:8081",
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log("Synchronized.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use("/api", index);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

socketManager(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
