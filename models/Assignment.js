const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    assignmentDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        // 👈 Add 'Active' here to match the word used in app.js
        enum: ['Active', 'Returned', 'Damaged', 'Pending'], 
        default: 'Active' 
    }
}, { timestamps: true });

module.exports = mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);