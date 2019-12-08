const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controller/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);

router.get("/sign-in", usersController.signin);
router.get("/sign-up", usersController.signup);
router.get("/sign-out", usersController.destroySession);
router.get("/forgot-password", usersController.forgotPassword);

router.post("/create", usersController.create);
router.post("/reset_password", usersController.resetPassword);
// use passport as middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/reset_password/:id", usersController.resetPasswordPage);
router.post("/reset_password/:id", usersController.updatePassword);

module.exports = router;
