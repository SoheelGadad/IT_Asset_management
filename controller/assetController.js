const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset"); // Ensure this matches your filename (Asset.js)

// ✅ FIX: Use curly braces to pull the specific function from the middleware object
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

/**
 * 🖥️ ASSET ROUTES
 */

// 1. GET ALL ASSETS
router.get("/assets", verifyToken, async (req, res) => {
  try {
    // Populate shows user details instead of just an ID string
    const assets = await Asset.find({}).populate('assignedUser', 'username email userId'); 
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets", error: error.message });
  }
});

// 2. GET SINGLE ASSET BY ASSETID (e.g., AST-2026-1234)
router.get("/assets/:id", verifyToken, async (req, res) => {
  const assetId = req.params.id.toUpperCase(); // Standardize to uppercase
  try {
    const details = await Asset.findOne({ assetId }).populate('assignedUser');
    if (!details) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 3. CREATE NEW ASSET (Admin Only)
router.post("/assets", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    const existing = await Asset.findOne({ assetId: data.assetId });
    if (existing) return res.status(400).json({ message: "Asset ID already exists" });

    const result = await Asset.create(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to create asset", error: error.message });
  }
});

// 4. UPDATE ASSET (Admin Only)
router.put("/assets/:id", verifyToken, verifyAdmin, async (req, res) => {
  const assetId = req.params.id.toUpperCase();
  const data = req.body;
  try {
    const result = await Asset.findOneAndUpdate(
      { assetId: assetId },
      data,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json({ message: "Asset updated successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

// 5. DELETE ASSET (Admin Only)
router.delete("/assets/:id", verifyToken, verifyAdmin, async (req, res) => {
  const assetId = req.params.id.toUpperCase();
  try {
    const result = await Asset.findOneAndDelete({ assetId: assetId });
    if (!result) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
});

module.exports = router;