import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(upload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getProfile);
router;
router.route("/profile/update").post(isAuthenticated, upload, updateProfile);

export default router;
