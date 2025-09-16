import mongoose from 'mongoose'; 

const SalesSchema = new mongoose.Schema({
    lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    sales_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    offer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }, 
    item_type: {
        type: String,
        enum: ['Offer', 'Product']
    },
    sale_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Approve', 'Reject'],
        default: 'Pending'
    }, 
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model('Sales', SalesSchema);