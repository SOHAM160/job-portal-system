const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * Verify JWT token from role-specific cookies, legacy cookie, or Authorization header.
 * When multiple role cookies exist (simultaneous login), tries to find the correct
 * one by checking each cookie's decoded role.
 */
const authenticate = async (req, res, next) => {
  try {
    // Collect all possible tokens: role-specific cookies, legacy, and header
    const possibleTokens = [];

    // Role-specific cookies
    for (const role of ["candidate", "recruiter", "admin"]) {
      const t = req.cookies?.[`token_${role}`];
      if (t) possibleTokens.push(t);
    }

    // Legacy cookie
    if (req.cookies?.token) possibleTokens.push(req.cookies.token);

    // Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      possibleTokens.push(req.headers.authorization.split(" ")[1]);
    }

    if (possibleTokens.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    // Store all valid decoded users so authorize() can pick the right role
    const validUsers = [];
    for (const token of possibleTokens) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          // IMPORTANT: Simultaneous Login Support
          // We use the role stored in the JWT for this specific session, 
          // allowing one user ID to act as different roles in different tabs.
          const userObj = user.toObject();
          userObj.role = decoded.role || user.role;
          validUsers.push(userObj);
        }
      } catch {
        // skip invalid tokens
      }
    }

    if (validUsers.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Store all valid users; authorize() will pick the one with the right role
    req.user = validUsers[0];
    req._validUsers = validUsers;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Role-based access control middleware
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // If we have multiple valid users from simultaneous login, 
    // pick the one that matches the requested roles
    if (req._validUsers && req._validUsers.length > 1) {
      const matchingUser = req._validUsers.find(u => roles.includes(u.role));
      if (matchingUser) {
        req.user = matchingUser;
      }
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
