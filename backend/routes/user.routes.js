const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
} = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes below require authentication
router.use(authenticate);

router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", getUserById);
router.put("/profile", updateProfile);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
