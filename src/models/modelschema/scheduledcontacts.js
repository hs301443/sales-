import mongoose from 'mongoose'; 

const ScheduledContactsSchema = new mongoose.Schema({
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
    contact_time: {
        type: String,
        required: [true, "Contact Time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in HH:MM format"]
    },
    notes: {
        type: String,
        required: [true, "Notes is required"],
    }, 
    status: {
        type: Boolean,
        default: false,
    }, 
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models.ScheduledContacts || mongoose.model('ScheduledContacts', ScheduledContactsSchema);