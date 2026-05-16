const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.Authtoken;
  
  if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
  }
  
  try {
    // 1. Use the environment variable, with a fallback for local testing
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secretKey);
    
    req.userType = decoded.userType;
    req.userId = decoded.userId;
    req.userEmail = decoded.userEmail;
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// 2. New function specifically to protect Admin-only routes
function verifyAdmin(req, res, next) {
  // First, run the standard token check
  verifyToken(req, res, () => {
    // Then, check if the decoded token role is 'admin'
    if (req.userType && req.userType.toLowerCase() === "admin") {
      next(); // Let them through
    } else {
      res.status(403).json({ error: "Access denied. Admin privileges required." });
    }
  });
}

// Export both functions so you can use them in different routes
module.exports = { verifyToken, verifyAdmin };