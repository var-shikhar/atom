import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyerName: {
        type: String,
        required: true,
    },
    buyerEmail: {
        type: String,
        required: true,
    },
    buyerPhone: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        billingAddress: { 
            type: String, 
            required: true 
        },
        shippingAddress: { 
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
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    totalTax: {
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
        },
        hasFeedback: {
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
            rating: {
                type: Number,
                required: false,
                default: 0
            },
            date: {
                type: Date,
                required: false,
            }
        }
    }],
    status: {
        type: String,
        enum: ['Pending', 'Received', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
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
        },
        updateDate: {
            type: Date,
            required: false,
            default: Date.now
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
        rating: {
            type: Number,
            required: false,
            default: 0
        }
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
