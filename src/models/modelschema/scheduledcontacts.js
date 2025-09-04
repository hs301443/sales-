import mongoose from 'mongoose'; 

const PaymentSchema = new mongoose.Schema({
    lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    sales_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    contact_date: {
        type: Date,
        required: [true, "Contact Date is required"],
    },
    notes: {
        type: String,
        required: [true, "Notes is required"],
    }, 
    status: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model('ScheduledContacts', PaymentSchema);