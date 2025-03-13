require("dotenv").config();
const jwt = require("jsonwebtoken");
const formatResponse = require("../utils/formatResponse");

function verifyRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
    res.locals.user = user;
    next();
  } catch (error) {
    console.log("======= Invalid refresh token =======", error.message);
    res.status(401).clearCookie("refreshToken").json(formatResponse(401, "Invalid refresh token", null, error.message));
  }
}

module.exports = verifyRefreshToken;
