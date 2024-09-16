import mongoose from "mongoose";

const ContactLeadSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: false,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Resolved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });


const ContactLead = mongoose.model('ContactLead', ContactLeadSchema);
export default ContactLead