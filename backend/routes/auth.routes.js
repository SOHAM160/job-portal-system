const express = require("express");
const { body } = require("express-validator");
const { register, login, logout, getMe, googleLogin } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

// ── Validation rules ───────────────────────────────────────
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["candidate", "recruiter", "admin"])
    .withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── Routes ─────────────────────────────────────────────────
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

module.exports = router;
