import mongoose from 'mongoose'; 

const CommissionSchema = new mongoose.Schema({
    point_threshold: {  
        type: Number,
        required: [true, "Point Threshold is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'], 
        required: [true, 'You Must Select Type']
    },
    level_name: {
        type: String,
        required: [true, "Level Name is required"],
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model('Commission', CommissionSchema);