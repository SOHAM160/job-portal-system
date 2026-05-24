const express = require("express");
const { registerCompany, getCompanies, getCompanyById, updateCompany } = require("../controllers/company.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("recruiter", "admin"));

router.post("/register", registerCompany);
router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);

module.exports = router;
