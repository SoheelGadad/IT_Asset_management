const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    assetName: { type: String }, // 👈 Added
    assetType: { type: String }, // 👈 Added
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    requestDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Request || mongoose.model("Request", RequestSchema);