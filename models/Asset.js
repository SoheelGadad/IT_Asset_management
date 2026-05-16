const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
    assetId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Available', 'Active', 'Maintenance', 'Retired'], 
        default: 'Available' 
    },
    assignedUser: { type: String, default: null }
}, { timestamps: true });

// ✨ THE FIX: Check if the model exists before exporting
module.exports = mongoose.models.Asset || mongoose.model("Asset", AssetSchema);