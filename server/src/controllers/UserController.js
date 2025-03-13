const UserService = require("../services/UserService");
const UserValidator = require("../utils/UserValidator");
const formatResponse = require("../utils/formatResponse");
const bcrypt = require("bcrypt");
const generateTokens = require("../utils/generateTokens");
const cookiesConfig = require("../config/cookiesConfig");

class UserController {
  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      const { accessToken, refreshToken } = generateTokens({ user });
      res.status(200).cookie("refreshToken", refreshToken, cookiesConfig).json(
        formatResponse(200, "Successfully regenerate tokens", {
          user,
          accessToken,
        })
      );
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Found", null, message));
    }
  }
  static async signUp(req, res) {
    const { name, email, password, role } = req.body;
    const { isValid, error } = UserValidator.validateSignUp({
      name,
      email,
      password,
      role,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, "Validation error", null, error));
    }

    const normalizeEmail = email.toLowerCase();
    try {
      const userFound = await UserService.getByEmail(normalizeEmail);

      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "User already exists",
              null,
              "User already exists"
            )
          );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserService.create({
        name,
        email: normalizeEmail,
        password: hashedPassword,
        role,
      });

      if (!newUser) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Failed to register user",
              null,
              "Failed to register user"
            )
          );
      }

      const plainUser = newUser.get({ plain: true });
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      res
        .status(201)
        .cookie("refreshToken", refreshToken, cookiesConfig)
        .json(
          formatResponse(201, "Register successful", {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;
    const { isValid, error } = UserValidator.validateSignIn({
      email,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, "Validation error", null, error));
    }
    const normalizedEmail = email.toLowerCase();
    try {
      const user = await UserService.getByEmail(normalizedEmail);
      if (!user) {
        return res
          .status(400)
          .json(formatResponse(400, "User not found", null, "User not found"));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json(
            formatResponse(400, "Invalid password", null, "Invalid password")
          );
      }
      const plainUser = user.get({ plain: true });
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({
        user: plainUser,
      });
      res
        .status(200)
        .cookie("refreshToken", refreshToken, cookiesConfig)
        .json(
          formatResponse(200, "Login successful", {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, message));
    }
  }
  static async signOut(req, res) {
    try {
      res
        .clearCookie("refreshToken")
        .json(formatResponse(200, "Logout successfully"));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, message));
    }
  }
}

module.exports = UserController;
