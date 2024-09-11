import CONSTANT from "../constant/constant.js";
import Coupon from "../modal/coupon.js";

const { RouteCode } = CONSTANT;

const getCouponList = async (req, res) => {
    try {
        const couponList = await Coupon.find().sort({ createdAt: 1 });

        return res.status(RouteCode.SUCCESS.statusCode).json(couponList);
    } catch (err) {
        console.error('Error retrieving Coupon list:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
}
// POST Controller
const postCoupon = async (req, res) => {
    const {  id, couponCode, discountType, discountValue, minOrderAmount, maxDiscountedAmount, startDate, expirationDate, limitUsage, isActive } = req.body;
    try {
        let hasCode = await Coupon.findOne({ code: couponCode.trim() });
        if (hasCode) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Coupon already exists, Change Coupon Code!' });
        }

        const newCoupon = new Coupon({
            code: couponCode,
            discountType: discountType,
            discountValue: discountValue, 
            maxDiscount: maxDiscountedAmount,
            minOrderAmount: minOrderAmount,
            expirationDate: new Date(expirationDate),
            usageLimit: limitUsage,
            isActive: isActive,
            startDate: new Date(startDate),
            usedCount: 0
        });

        await newCoupon.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Coupon has created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
// Get Init Details
const getInitCoupon = async (req, res) => {
    const { couponID } = req.params;
    try {
        // Find the Service
        const coupon = await Coupon.findById(couponID);
        if (!coupon) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        // Construct category details
        const couponDetail = {
            id: coupon._id,
            couponCode: coupon.code ?? '',
            discountType: coupon.discountType ?? '',
            discountValue: coupon.discountValue ?? '',
            minOrderAmount: coupon.minOrderAmount ?? 0,
            maxDiscountedAmount: coupon.maxDiscount ?? 0,
            expirationDate: new Date(coupon.expirationDate).toISOString().split('T')[0] ?? '',
            limitUsage: coupon.usageLimit ?? 0,
            isActive: coupon.isActive ?? false,
            startDate: new Date(coupon.startDate).toISOString().split('T')[0] ?? '',
        };

        // Send response with product details
        return res.status(RouteCode.SUCCESS.statusCode).json(couponDetail);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};
// Put Controller
const putCoupon = async (req, res) => {
    const { id, couponCode, discountType, discountValue, minOrderAmount, maxDiscountedAmount, startDate, expirationDate, limitUsage, isActive } = req.body;
    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        if (coupon.code !== couponCode) {
            const hasCode = await Coupon.findOne({ code: couponCode });
            if (hasCode) {
                return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Coupon already exists, Try different code!' });
            }
        }

        coupon.code = couponCode ?? coupon.code;
        coupon.discountType = discountType ?? coupon.discountType;
        coupon.discountValue = discountValue ?? coupon.discountValue;
        coupon.minOrderAmount = minOrderAmount ?? coupon.minOrderAmount;
        coupon.maxDiscount = maxDiscountedAmount ?? coupon.maxDiscount;
        coupon.startDate = new Date(startDate) ?? coupon.startDate;
        coupon.expirationDate = new Date(expirationDate) ?? coupon.expirationDate;
        coupon.usageLimit = limitUsage ?? coupon.usageLimit;
        coupon.isActive = isActive ? true : false;

        await coupon.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Coupon has updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const putCouponStatus = async (req, res) => {
    const { couponID, value } = req.body;
    try {
        const coupon = await Coupon.findById(couponID);
        if (!coupon) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        coupon.isActive = value;
        await coupon.save();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Coupon has updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
// Delete Controller
const deleteCoupon = async (req, res) => {
    const { couponID } = req.params;
    try {
        const coupon = await Coupon.findById(couponID);
        if (!coupon) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({ message: RouteCode.NOT_FOUND.message });
        }

        await coupon.deleteOne();
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Coupon has deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};

export default {
    getCouponList, 
    postCoupon, getInitCoupon, putCoupon, putCouponStatus, deleteCoupon
}