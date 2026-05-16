const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    assetId: { 
        type: String, 
        unique: true, 
        required: [true, 'Asset ID is required'],
        trim: true 
    },
    assetName: { 
        type: String, 
        required: [true, 'Asset name is required'],
        trim: true 
    },
    assetType: { 
        type: String, 
        required: true,
        enum: ['Laptop', 'Mobile', 'Monitor', 'Furniture', 'Other'] // Optional: Restricts types
    },
    model: { 
        type: String, 
        required: true 
    },
    serialNumber: { 
        type: String, 
        unique: true, 
        required: true,
        uppercase: true // Standardizes serial numbers
    },
    purchaseDate: { 
        type: Date, 
        required: true 
    },
    warranty: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    // ✨ ENHANCED: Reference to a User model instead of just a String
    assignedUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Maintenance', 'Retired'],
        default: 'Available'
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Create an index for faster searching by Asset ID
assetSchema.index({ assetId: 1 });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;