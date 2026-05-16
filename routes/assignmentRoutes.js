// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

// ✅ FIX: Imported BOTH verifyToken and verifyAdmin
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

/**
 * 🔗 ASSIGNMENT MANAGEMENT
 * Note: We use verifyToken BEFORE verifyAdmin for all routes
 */

// 1. CREATE ASSIGNMENT - Admin only
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, assetId, assignmentDate, status } = req.body;
    
    if (!userId || !assetId || !assignmentDate) {
      return res.status(400).json({ message: "userId, assetId and assignmentDate are required" });
    }

    // Check if asset is already tied to an active assignment
    const existingAssignment = await Assignment.findOne({ assetId, status: 'Active' });
    if (existingAssignment) {
      return res.status(400).json({ message: "This asset is already assigned to another user." });
    }

    const newAssignment = new Assignment({ 
        userId, 
        assetId, 
        assignmentDate,
        status: status || 'Active' 
    });

    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("Assignment Error:", error);
    res.status(500).json({ message: "Server error during assignment" });
  }
});

// 2. GET ALL ASSIGNMENTS - Admin only
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // ✨ ENHANCEMENT: Populate details to show real names in your React Table
    const assignments = await Assignment.find()
      .populate('userId', 'username email') // Assumes ref: 'AdminUser' or 'User' in Model
      .populate('assetId', 'assetName model serialNumber'); // Assumes ref: 'Asset' in Model
      
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. GET SINGLE ASSIGNMENT - Admin only
router.get("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('userId')
      .populate('assetId');
      
    if (!assignment) {
      return res.status(404).json({ message: "Assignment record not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. UPDATE ASSIGNMENT - Admin only
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, assetId, assignmentDate, status } = req.body;
    
    // Using findByIdAndUpdate is cleaner for updates
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: { userId, assetId, assignmentDate, status } },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment updated successfully", data: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Update failed: " + error.message });
  }
});

// 5. DELETE/RELEASE ASSIGNMENT - Admin only
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ message: "Assignment record not found" });
    }

    res.json({ message: "Assignment deleted/released successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

module.exports = router;