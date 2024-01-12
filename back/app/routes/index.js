const express = require("express");
const { authJwt } = require("../middleware");

const router = express.Router();

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  if (req.path.startsWith("/auth")) {
    return next();
  }

  authJwt.verifyToken(req, res, next);
});

router.use(
  "/auth",
  require("./auth.routes")
  /* 
#swagger.tags = ['Auth']
*/
);

router.use(
  "/cantine",
  require("./cantine.routes")
  /* 
  #swagger.tags = ['Cantine']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/categorie",
  require("./categorie.routes")
  /* 
  #swagger.tags = ['Categorie']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/commande",
  require("./commande.routes")
  /* 
  #swagger.tags = ['Commande']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/indisponibilite",
  require("./indisponibilite.routes")
  /* 
  #swagger.tags = ['Indisponibilite']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/ingredient",
  require("./ingredient.routes")
  /* 
  #swagger.tags = ['Ingredient']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/menu",
  require("./menu.routes")
  /* 
  #swagger.tags = ['Menu']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/notification",
  require("./notification.routes")
  /* 
  #swagger.tags = ['Notification']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/overview",
  require("./overview.routes")
  /* 
  #swagger.tags = ['Overview']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/plat",
  require("./plat.routes")
  /* 
  #swagger.tags = ['Plat']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

router.use(
  "/utilisateur",
  require("./utilisateur.routes")
  /* 
  #swagger.tags = ['Utilisateur']

  #swagger.security = [{
      "apiKeyAuth": []
  }]
  */
);

module.exports = router;
