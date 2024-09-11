import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Fixed'],
        required: true,
        default: 'Percentage'
    },
    discountValue: {
        type: Number,
        required: true
    },
    minOrderAmount: {
        type: Number,
        required: true,
        default: 0
    },
    maxDiscount: {
        type: Number,
        required: false,
        default: null
    },
    startDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        required: false,
        default: 1
    },
    usedCount: {
        type: Number,
        required: false,
        default: 0
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true });

// Middleware to deactivate expired coupons
couponSchema.pre('save', function(next) {
    if (this.expirationDate && new Date() > this.expirationDate) {
        this.isActive = false;
    }
    next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
