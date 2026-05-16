const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); // ✅ FIXED: Added missing path module
require("dotenv").config();

const app = express();

/**
 * ⚙️ CLOUD & SECURITY CONFIGURATION
 */
app.set("trust proxy", 1); 

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5001", 
  process.env.FRONTEND_URL  
];

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

/**
 * 🚀 API ROUTES
 */
app.use("/api", assetRoutes);
app.use("/api", authRoute);
app.use("/api", adminRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api", employee);

/**
 * 📩 ASSET SELF-SERVICE & AUTOMATION FLOW
 */

// 1. Employee: Submit claim for a new asset (Requires Login)
app.post('/api/requests', verifyToken, async (req, res) => {
    try {
        const { assetId, model, assetType, serialNo, location } = req.body;

        const newRequest = new Request({
            userId: req.userId, // Taken from the verified token
            assetId, 
            model,
            assetType,
            serialNo,
            location,
            assignmentDate: new Date(),
            status: 'pending'
        });

        await newRequest.save();
        res.status(201).json({ message: "Request received. Admin will verify shortly." });
    } catch (error) {
        res.status(500).json({ error: "Failed to process request." });
    }
});

// 2. Admin: Get all pending requests (Requires Admin Login)
app.get('/api/requests/pending', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const requests = await Request.find({ status: 'pending' });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: "Error fetching requests." });
    }
});

// 3. Admin: APPROVE & AUTO-MIGRATE (Requires Admin Login)
app.put('/api/requests/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Request not found" });

        // Update or Create the Asset in Inventory
        await Asset.findOneAndUpdate(
            { assetId: request.assetId },
            { 
                assetName: request.model || "New Asset",
                assetType: request.assetType,
                serialNumber: request.serialNo,
                location: request.location,
                assignedUser: request.userId,
                status: 'Assigned' 
            },
            { upsert: true, new: true }
        );

        // Record the Assignment
        const newAssignment = new Assignment({
            userId: request.userId,
            assetId: request.assetId,
            assignmentDate: new Date(),
            status: 'Active'
        });
        await newAssignment.save();

        request.status = 'approved';
        await request.save();

        res.status(200).json({ message: "Approved! Asset inventory and assignment updated." });
    } catch (error) {
        console.error("Approve Error:", error);
        res.status(500).json({ error: "Internal Server Error during approval." });
    }
});

// 4. Admin: REJECT REQUEST (Requires Admin Login)
app.put('/api/requests/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ error: "Request not found" });

        request.status = 'rejected';
        await request.save();

        res.status(200).json({ message: "Request rejected successfully." });
    } catch (error) {
        res.status(500).json({ error: "Error during rejection." });
    }
});

/**
 * 🌐 STATIC FILE SERVING FOR PRODUCTION
 */
// 1. Serve the compiled static assets (js, css, images) from the frontend build folder
app.use(express.static(path.join(__dirname, "./frontend/dist")));

// 2. Catch-all route to serve index.html for your SPA client-side routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});
/**
 * 🏁 SERVER STARTUP
 */
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI missing in .env");
      process.exit(1); 
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");

    const PORT = process.env.PORT || 8000; 
    
    // ✅ FIXED: Removed "0.0.0.0" so Azure Windows can safely use named pipes
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port/pipe: ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();