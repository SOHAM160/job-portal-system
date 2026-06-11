const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User.model");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: generate JWT & set role-specific cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Use role-specific cookie name so multiple roles can be logged in simultaneously
  const cookieName = `token_${user.role}`;

  // Remove password from output
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie(cookieName, token, cookieOptions).json({
    success: true,
    token,
    user: userObj,
  });
};

// ── Register ───────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ── Login ──────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check user exists & include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ── Logout ─────────────────────────────────────────────────
exports.logout = (req, res) => {
  // Clear the role-specific cookie
  const role = req.query.role || req.body.role || "";
  const clearCookieOpts = { httpOnly: true, expires: new Date(0) };

  if (role) {
    // Clear only the specific role cookie
    res.cookie(`token_${role}`, "", clearCookieOpts);
  } else {
    // Fallback: clear all role cookies
    res.cookie("token_candidate", "", clearCookieOpts);
    res.cookie("token_recruiter", "", clearCookieOpts);
    res.cookie("token_admin", "", clearCookieOpts);
    res.cookie("token", "", clearCookieOpts); // legacy cleanup
  }

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ── Get Current User ───────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const requestedRole = req.query.role || req.headers["x-user-role"];
    let user = req.user;

    if (requestedRole && req._validUsers) {
      const matchingUser = req._validUsers.find(u => u.role === requestedRole);
      if (matchingUser) user = matchingUser;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ── Google Login ──────────────────────────────────────────
exports.googleLogin = async (req, res, next) => {
  try {
    const { tokenId, role } = req.body;
    if (!tokenId) {
      return res.status(400).json({ success: false, message: "Token ID is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ 
      $or: [{ googleId }, { email }]
    });

    if (user) {
      // If user exists but googleId wasn't linked, link it
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.profilePicture) user.profilePicture = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        role: role || "candidate", // Use provided role or default
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ success: false, message: "Google authentication failed" });
  }
};
