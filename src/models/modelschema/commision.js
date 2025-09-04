import mongoose from 'mongoose'; 

const CommisionSchema = new mongoose.Schema({
    point_threshlod: {
        type: Number,
        required: [true, "Point Threshlod is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    type: {
        type: String,
        enum: ['precentage', 'fixed'],
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
});

export default mongoose.model('Commision', CommisionSchema);