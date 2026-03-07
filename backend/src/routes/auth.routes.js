import express from "express";
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  getMeController
} from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
router.post("/login", loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout user and clear token
 * @access Public
 */
router.get("/logout",logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
router.get("/get-me", authUser,getMeController)

export default router;