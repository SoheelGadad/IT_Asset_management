const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUser"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * 📝 USER REGISTRATION
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, userType } = req.body;
    
    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password and generate ID
    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedUserId = "EMP-" + Date.now(); 

    const newUser = new AdminUser({ 
        userId: generatedUserId,
        username: username, 
        password: hashedPassword, 
        email: email, 
        role: userType || "employee", // Default to employee if not provided
        status: 'pending' // Requires Admin Approval
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: "Registration successful. Please wait for an Admin to approve your account." 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed due to server error" });
  }
});

/**
 * 🔑 USER LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🛑 Check Account Approval Status
    if (user.status === 'pending') {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ error: "Your account request was declined." });
    }

    // Verify Password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.userId, userType: user.role, userEmail: user.email },
      process.env.JWT_SECRET || "PeopleDesk_Secure_Auth_Key_2026_!@#",
      { expiresIn: "8h" }
    );

    // ✨ COOKIE CONFIGURATION (Critical for Render/Production)
    // We use 'none' for sameSite because frontend and backend are on different domains
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("Authtoken", token, {
      httpOnly: true, 
      secure: true, // Always true for Render/HTTPS
      sameSite: "none", // Required for cross-domain requests
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      path: "/"           
    });

    // ✅ JSON RESPONSE: Sends details back to React
    res.status(200).json({
      status: true,
      message: "Login successful",
      token: token, // Sent for localStorage fallback
      userType: user.role,
      userId: user.userId,
      username: user.username 
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed due to server error" });
  }
});

/**
 * 🚪 LOGOUT
 */
router.get("/logout", (req, res) => {
  res.clearCookie("Authtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;