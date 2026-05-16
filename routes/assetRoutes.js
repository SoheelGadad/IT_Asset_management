const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset"); 
const AdminUser = require("../models/AdminUser"); 
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

/**
 * 📦 ASSET MANAGEMENT ROUTES
 */

// 1. Get all assets (Includes User Details)
router.get("/assets", verifyToken, async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.json(assets);
  } catch (error) {
    console.error("Fetch Assets Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Get single asset by AssetID (e.g., AST-2026-1234)
router.get("/assets/:id", verifyToken, async (req, res) => {
  const id = req.params.id.toUpperCase();
  try {
    const asset = await Asset.findOne({ assetId: id });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Create new asset (Admin only)
router.post("/assets", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    // Check if assetId already exists to prevent duplicates
    const existing = await Asset.findOne({ assetId: data.assetId });
    if (existing) return res.status(400).json({ error: "Asset ID already exists" });

    const result = await Asset.create(data);
    res.status(201).json(result);
  } catch (error) {
    console.error("Create Asset Error:", error);
    res.status(500).json({ error: "Could not create asset" });
  }
});

// 4. Update asset and PUSH TO HISTORY (Admin only)
router.put("/assets/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id; // This could be _id or assetId string
  const { name, assetName, type, assetType, status, assignedUser, location, serialNumber, notes, model } = req.body;

  try {
    // Construct the fields to update
    const fieldsToUpdate = {
      assetName: assetName || name || model,
      assetType: assetType || type,
      status,
      assignedUser,
      location,
      serialNumber,
      model
    };

    // Remove undefined fields so they don't overwrite with null
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    const updateQuery = {
      $set: fieldsToUpdate,
      $push: { 
        statusHistory: { 
          note: notes || "Configuration updated by Admin", 
          status: status || "Updated", 
          date: new Date() 
        } 
      }
    };

    // Try finding by custom assetId string first (standard for your project)
    let result = await Asset.findOneAndUpdate(
      { assetId: id.toUpperCase() }, 
      updateQuery, 
      { new: true, runValidators: true }
    );
    
    // Fallback to MongoDB _id if not found by string
    if (!result) {
      result = await Asset.findByIdAndUpdate(id, updateQuery, { new: true });
    }

    if (!result) return res.status(404).json({ error: "Asset not found" });
    
    res.json({ message: "Asset updated successfully", data: result }); 
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Update failed: " + error.message });
  }
});

// 5. Delete asset (Admin only)
router.delete("/assets/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id.toUpperCase();
  try {
    const result = await Asset.findOneAndDelete({ assetId: id });
    if (!result) return res.status(404).json({ error: "Asset not found" });
    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 6. Admin: Update User Role/Status (Alternative Route)
router.put("/users/manage/:userId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;
    
    const updatedUser = await AdminUser.findOneAndUpdate(
      { userId: userId }, 
      { $set: { role: role, status: status } },
      { new: true } 
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error while updating user" });
  }
});

module.exports = router;