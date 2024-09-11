import express from "express";
import { isAuth } from "../middleware/isAuthenticated.js";
import isMulterApproved from "../middleware/isMulterApproved.js";

import authController from '../controller/auth.js';
import categoryController from '../controller/category.js';
import subCategoryController from '../controller/subCategory.js';
import productController from '../controller/product.js';
import variationController from '../controller/variation.js';
import orderController from '../controller/order.js';
import memberContoller from '../controller/member.js';
import couponContoller from '../controller/coupon.js';


// import publicController  from '../controller/booking.js';

const router = express.Router();

// Auth Routes
router.route('/auth/login').post(authController.postLogin);
router.route('/auth/logout').get(isAuth, authController.getLogout);

// Category and SubCategory
router.route('/admin/category').post(isAuth, categoryController.postCategory).put(isAuth, categoryController.putCategory).get(isAuth, categoryController.getCategoryList);
router.route('/admin/category/:categoryID').get(isAuth, categoryController.getInitCategory).put(isAuth, categoryController.putCategoryStatus).delete(isAuth, categoryController.deleteCategory);

router.route('/admin/subCategory').post(isAuth, subCategoryController.postSubCategory).put(isAuth, subCategoryController.putSubCategory).get(isAuth, subCategoryController.getSubCategoryList);
router.route('/admin/subCategory/:categoryID').get(isAuth, subCategoryController.getInitSubCategory).put(isAuth, subCategoryController.putSubCategoryStatus).delete(isAuth, subCategoryController.deleteSubCategory);

// Product Routes
router.route('/admin/product/variation/:productID/:variationID').get(isAuth, variationController.getInitVariation).put(isAuth, variationController.putVariationStatus).delete(isAuth, variationController.deleteVariation);
router.route('/admin/product/variation').post(isAuth, isMulterApproved, variationController.postVariation).put(isAuth, isMulterApproved, variationController.putVariation);

router.route('/admin/product').post(isAuth, isMulterApproved, productController.postProduct).put(isAuth, isMulterApproved, productController.putProduct).get(isAuth, productController.getProductList);
router.route('/admin/product/:productID').get(isAuth, productController.getInitProduct).put(isAuth, productController.putProductStatus).delete(isAuth, productController.deleteProduct);

// Coupons
router.route('/admin/coupon').post(isAuth, couponContoller.postCoupon).put(isAuth, couponContoller.putCoupon).get(isAuth, couponContoller.getCouponList);
router.route('/admin/coupon/:couponID').get(isAuth, couponContoller.getInitCoupon).put(isAuth, couponContoller.putCouponStatus).delete(isAuth, couponContoller.deleteCoupon)


// Customer Routes
router.route('/admin/customer').get(isAuth, memberContoller.getMemberList);

// Order Routes
router.route('/admin/order').get(isAuth, orderController.getOrderList);
router.route('/admin/order/status/:orderID?').get(isAuth, orderController.getStatusList).put(isAuth, orderController.putOrderStatusUpdate)
router.route('/admin/order/:orderID').get(isAuth, orderController.getOrderDetail);



// Public Routes
// Authentication
router.route('/public/auth/login').post(authController.postPublicLogin);
router.route('/public/auth/logout').get(isAuth, authController.getLogout);
router.route('/public/auth/register').post(authController.postPublicRegister);
router.route('/public/auth/forgot-password').post(authController.postRequestPasswordReset);
router.route('/public/auth/password-update').post(authController.putResetPassword);

router.route('/public/product').get(productController.getPublicProductList);
router.route('/public/product/:productID').get(productController.getPublicProductDetails);
router.route('/public/latest-product').get(productController.getLatestProduct);

router.route('/public/checkout').get(orderController.getAPIAddress).post(isAuth, orderController.postCheckout).put(isAuth, orderController.putOrderConfirmation);
router.route('/public/order').post(isAuth, orderController.postGoToCheckout).put(isAuth, orderController.putValidateCoupon);

router.use('/', async (req, res) => {
    console.log(req.originalUrl);
    return res.send({ message: 'Undefined Request URL' })
})

export default router;