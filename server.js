const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs"); // Updated to bcryptjs for Azure compatibility
const path = require("path");
require("dotenv").config();
const fs = require('fs');
const app = express();

/**
 * ⚙️ CLOUD & SECURITY CONFIGURATION
 */
app.set("trust proxy", 1); 

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5001",
  "https://backend-of-it-asset-management.onrender.com", 
  process.env.FRONTEND_URL  
];

// CORS configuration for production
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

/**
 * 🧭 IMPORT MODELS & AUTH MIDDLEWARE
 */
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");
const Asset = require("./models/Asset");   
const Request = require("./models/Request"); 
const Assignment = require('./models/Assignment');

/**
 * 🚀 ROUTE IMPORTS
 */
const assetRoutes = require("./routes/assetRoutes");
const authRoute = require("./routes/auth");
const adminRoutes = require("./routes/AdminUsers");
const assignmentRoutes = require('./routes/assignmentRoutes');
const employee = require('./routes/employee');

app.use("/api", assetRoutes);
app.use("/api", authRoute);
app.use("/api", adminRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api", employee);

/**
 * 📩 ASSET SELF-SERVICE & AUTOMATION FLOW
 */

app.post('/api/requests', verifyToken, async (req, res) => {
    try {
        const { assetId, model, assetType, serialNo, location } = req.body;
        const newRequest = new Request({
            userId: req.userId, 
            assetId, 
            model,
            assetType,
            serialNo,
            location,
            assignmentDate: new Date(),
            status: 'pending'
        });
        await newRequest.save();
        res.status(201).json({ message: "Request received." });
    } catch (error) {
        res.status(500).json({ error: "Failed to process request." });
    }
});

app.get('/api/requests/pending', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const requests = await Request.find({ status: 'pending' });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: "Error fetching requests." });
    }
});

app.put('/api/requests/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Request not found" });

        await Asset.findOneAndUpdate(
            { assetId: request.assetId },
            { 
                assetName: request.model || "Assigned Asset",
                assetType: request.assetType,
                serialNumber: request.serialNo,
                location: request.location,
                assignedUser: request.userId,
                status: 'Assigned' 
            },
            { upsert: false } 
        );

        const newAssignment = new Assignment({
            userId: request.userId,
            assetId: request.assetId,
            assignmentDate: new Date(),
            status: 'Active'
        });
        await newAssignment.save();

        request.status = 'approved';
        await request.save();

        res.status(200).json({ message: "Approved successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error during approval." });
    }
});

app.put('/api/requests/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Request not found" });
        request.status = 'rejected';
        await request.save();
        res.status(200).json({ message: "Request rejected." });
    } catch (error) {
        res.status(500).json({ error: "Error during rejection." });
    }
});

/**
 * 🌐 STATIC FILE SERVING FOR AZURE PRODUCTION
 */
const frontendDistPath = path.join(__dirname, "frontend", "dist");

app.use(express.static(frontendDistPath));

// Catch-all route for SPA Routing
app.get("*", (req, res, next) => {
    // 1. Let API routes pass through to express routers
    if (req.url.startsWith('/api/')) return next();

    // 2. Safely resolve the requested file path
    const safeUrl = req.url.split('?')[0]; 
    const filePath = path.join(frontendDistPath, safeUrl);

    // 3. Serve physical files if they exist (Fixes MIME type errors)
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        // 4. Otherwise, send index.html for React Router
        res.sendFile(path.join(frontendDistPath, "index.html"));
    }
});
/**
 * 🏁 SERVER STARTUP
 */
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI missing!");
      process.exit(1); 
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");

    // Correctly using process.env.PORT for Azure
    const PORT = process.env.PORT || 8080; 
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();