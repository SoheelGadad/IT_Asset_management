const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const userDB = require('../models/AdminUser');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * 🛠️ EMPLOYEE SELF-SERVICE ROUTES
 */

// 1. GET: Fetch assigned assets for the CURRENT logged-in employee
// ✨ SECURITY FIX: Instead of taking ID from URL, we take it from the token (req.userId)
router.get('/my-assets', verifyToken, async (req, res) => {
    try {
        const loggedInUserId = req.userId; // Provided by verifyToken middleware
        
        console.log(`Fetching assets for logged-in user: ${loggedInUserId}`);

        // ✨ ENHANCEMENT: .populate() ensures the employee sees asset NAMES, not just IDs
        const assignedAssets = await Assignment.find({ userId: loggedInUserId })
            .populate({
                path: 'assetId',
                select: 'assetName model serialNumber assetType location status'
            });

        console.log("Assigned Assets found:", assignedAssets.length);
        res.status(200).json(assignedAssets);
    } catch (error) {
        console.error("Error fetching my-assets:", error);
        res.status(500).json({ message: 'Error fetching assigned assets', error: error.message });
    }
});

// 2. GET: Fetch user details for the Profile page
router.get('/getEmployees', verifyToken, async (req, res) => {
    try {
        // req.userEmail is set by your verifyToken middleware
        const email = req.userEmail;
        
        // Find user but hide the password from the response
        const userDetails = await userDB.findOne({ email: email }).select("-password");
        
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Profile fetched for: ${email}`);
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error in getEmployees:", error);
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
});

// 3. GET: Legacy/Specific ID fetch (Keep this if your React Admin panel uses it)
router.get('/assigned-assets/employee/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const assignedAssets = await Assignment.find({ userId: id }).populate('assetId');
        res.status(200).json(assignedAssets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error: error.message });
    }
});

module.exports = router;