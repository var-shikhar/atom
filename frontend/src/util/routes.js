// const BACKEND_ROUTES = 'https://traffic-jam.onrender.com';
const BACKEND_ROUTES = 'http://localhost:8081';


const loginRoute = `${BACKEND_ROUTES}/auth/login`;
const logoutRoute = `${BACKEND_ROUTES}/auth/logout`;

const commonCategoryRoute = `${BACKEND_ROUTES}/admin/category`;
const commonSubCategoryRoute = `${BACKEND_ROUTES}/admin/subCategory`;

const commonProductRoute = `${BACKEND_ROUTES}/admin/product`;
const commonProductVariationRoute = `${BACKEND_ROUTES}/admin/product/variation`;

const commonOrderRoute = `${BACKEND_ROUTES}/admin/order`;
const commonOrderDetailRoute = `${BACKEND_ROUTES}/admin/order/detail`;
const commonOrderStatusRoute = `${BACKEND_ROUTES}/admin/order/status`;

const commonCustomerRoute = `${BACKEND_ROUTES}/admin/customer`;
const commonCustomerDetailRoute = `${BACKEND_ROUTES}/admin/customer/detail`;

const commonCouponRoute = `${BACKEND_ROUTES}/admin/coupon`;

const commonContactLeadRoute = `${BACKEND_ROUTES}/admin/contact-lead`;



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