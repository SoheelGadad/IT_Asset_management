const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); 
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const AdminUser = require("../models/AdminUser");

/**
 * 👥 USER MANAGEMENT ROUTES (Admin Only)
 * All routes here require a valid Admin token
 */

// 1. Get all Users
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Exclude passwords from the results for security
    const users = await AdminUser.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

// 2. Get Single User by ID
router.get("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await AdminUser.findOne({ userId: userId }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Fetch Single User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Update User (Role, Status, or Password)
router.put("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  const targetUserId = req.params.id;
  let updateData = { ...req.body };

  try {
    // 🛡️ Security: If updating password, hash it
    if (updateData.password && updateData.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password; // Don't update password if it's empty
    }

    const result = await AdminUser.findOneAndUpdate(
      { userId: targetUserId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: result });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Update failed: " + error.message });
  }
});

// 4. Delete User
router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  const targetUserId = req.params.id;

  try {
    // 🛡️ Safety: Prevent Admin from deleting their own account
    if (targetUserId === req.userId) {
      return res.status(400).json({ error: "You cannot delete your own admin account." });
    }

    const result = await AdminUser.findOneAndDelete({ userId: targetUserId });
    
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Server error during deletion" });
  }
});

module.exports = router;