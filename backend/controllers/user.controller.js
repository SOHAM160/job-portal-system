const User = require("../models/User.model");

// @desc    Get all users (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Save Job
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;

    const isSaved = user.savedJobs.includes(jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.status(200).json({ success: true, savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};
