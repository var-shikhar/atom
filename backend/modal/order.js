import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        isVariation: {
            type: Boolean,
            required: true,
            default: false
        },
        variationId: {
            type: String,
            default: '',
            required: function() { return this.isVariation }
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    buyerName: {
        type: String,
        required: true,
    },
    buyerPhone: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    }, 
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippingAddress: {
        addressLine1: { 
            type: String, 
            required: true 
        },
        addressLine2: { 
            type: String,
            required: false,
        },
        city: { 
            type: String, 
            required: true 
        },
        stateId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'State', 
            required: true 
        },
        zipCode: { 
            type: String, 
            required: true 
        },
        countryId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Country', 
            required: true 
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    statusLog: [{
        status: {
            type: String,
            required: false,
        },
        note: {
            type: String,
            required: false
        }
    }],
    paymentMode: {
        type: String,
        enum: ['COD', 'Online'],
        required: true,
        default: 'Online'
    },
    receivedFeedback: {
        type: Boolean,
        required: false,
        default: false,
    },
    feedback: {
        text: {
            type: String,
            required: false,
            default: '',
        },
        image: {
            type: String,
            required: false,
            default: '',
        },
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
