const authRoutes = require("express").Router();
const UserController = require("../controllers/UserController");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");

authRoutes.get(
  "/refreshTokens",
  verifyRefreshToken,
  UserController.refreshTokens
);
authRoutes.post("/signUp", UserController.signUp);
authRoutes.post("/signIn", UserController.signIn);
authRoutes.get("/signOut", UserController.signOut);

module.exports = authRoutes;
