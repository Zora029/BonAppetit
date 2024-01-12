const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "v1.0.0",
    title: "BonAppetit API",
    description: "ExpressJS API for BonAppetit Project.",
  },
  host: "localhost:8080",
  basePath: "/api",
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "headers",
      name: "x-access-token",
      description: "Token",
    },
  },
  definitions: {
    Login: {
      $matricule_utilisateur: "ST11",
      $mot_de_passe: "root",
    },
    Register: {
      $matricule_utilisateur: "ST11",
      $nom_utilisateur: "Zo",
      $prenom_utilisateur: "Michael",
      $email_utilisateur: "zo.michael.andri@gmail.com",
      $tel_utilisateur: "0333452993",
      $poste_utilisateur: "stagiaire",
      $role_utilisateur: "admin",
      $mot_de_passe: "root",
    },
    arrayOfStrings: ["id"],
    objectSchema: {
      field: "example",
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
