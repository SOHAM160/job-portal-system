const Company = require("../models/Company.model");

exports.registerCompany = async (req, res, next) => {
  try {
    const { name } = req.body;
    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({ success: false, message: "Company already exists" });
    }
    company = await Company.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ userId: req.user._id });
    res.status(200).json({ success: true, companies });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
};
