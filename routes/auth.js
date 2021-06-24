const { verifySignup, authJWT } = require("../middleware");
const controller = require("../controllers/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/auth/signup",
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin, // admin users can only be created by existing admin, migrate the first
      verifySignup.checkDuplicateUsernameOrEmail,
      verifySignup.checkRoles,
    ],
    controller.signUp
  );

  app.post("/auth/signin", controller.signIn);

  app.post(
    "/auth/roles",
    [
      authJWT.verifyToken,
      authJWT.userIsAdmin,
      authJWT.checkAndFilterExistingRoles,
    ],
    controller.createRoles
  );
};