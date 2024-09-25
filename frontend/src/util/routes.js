const BACKEND_ROUTES = 'https://atom-7y9m.onrender.com';
// const BACKEND_ROUTES = 'http://localhost:8081';


const loginRoute = `${BACKEND_ROUTES}/admin/admin/auth/login`;
const logoutRoute = `${BACKEND_ROUTES}/admin/admin/auth/logout`;

const commonCategoryRoute = `${BACKEND_ROUTES}/admin/admin/category`;
const commonSubCategoryRoute = `${BACKEND_ROUTES}/admin/admin/subCategory`;

const commonProductRoute = `${BACKEND_ROUTES}/admin/admin/product`;
const commonProductVariationRoute = `${BACKEND_ROUTES}/admin/admin/product/variation`;

const commonOrderRoute = `${BACKEND_ROUTES}/admin/admin/order`;
const commonOrderDetailRoute = `${BACKEND_ROUTES}/admin/admin/order/detail`;
const commonOrderStatusRoute = `${BACKEND_ROUTES}/admin/admin/order/status`;

const commonCustomerRoute = `${BACKEND_ROUTES}/admin/admin/customer`;
const commonCustomerDetailRoute = `${BACKEND_ROUTES}/admin/admin/customer/detail`;

const commonCouponRoute = `${BACKEND_ROUTES}/admin/admin/coupon`;

const commonContactLeadRoute = `${BACKEND_ROUTES}/admin/admin/contact-lead`;



const ROUTES = {
    loginRoute, logoutRoute, 
    // Category Route
    commonCategoryRoute, commonSubCategoryRoute,
    commonProductRoute, commonProductVariationRoute,
    commonOrderRoute, commonOrderStatusRoute, commonOrderDetailRoute,
    commonCustomerRoute, commonCustomerDetailRoute,
    commonCouponRoute, commonContactLeadRoute,
}

export default ROUTES