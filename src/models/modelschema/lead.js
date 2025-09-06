import { types } from 'joi';
import mongoose from 'mongoose'; 

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        unique: [true, "Phone is found"],
    },
    address: {
        type: String, 
    },
    type: {
        type: String,
        enum: ['sales', 'company'],
        required: [true, 'You Must Select Type']
    },
    status: {
        type: String, 
        default: 'intersted',
        enum: ['intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve']
    },
    sales_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    activity_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    transfer: {
        type: Boolean,
        default: false,
    },
    source_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('Lead', LeadSchema);