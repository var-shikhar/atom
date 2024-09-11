// const BACKEND_ROUTES = 'https://traffic-jam.onrender.com';
const BACKEND_ROUTES = 'http://localhost:8081';


const loginRoute = `${BACKEND_ROUTES}/public/auth/login`;
const registerRoute = `${BACKEND_ROUTES}/public/auth/register`;
const forgotPasswordRoute = `${BACKEND_ROUTES}/public/auth/forgot-password`;
const passwordUpdateRoute = `${BACKEND_ROUTES}/public/auth/password-update`;
const logoutRoute = `${BACKEND_ROUTES}/public/auth/logout`;

const commonProductRoute = `${BACKEND_ROUTES}/public/product`;
const commonProductVariationRoute = `${BACKEND_ROUTES}/admin/product/variation`;
const getLatestProduct = `${BACKEND_ROUTES}/public/latest-product`;

const commonCheckoutRoute = `${BACKEND_ROUTES}/public/checkout`;
const postGOTOCheckoutRoute = `${BACKEND_ROUTES}/public/order`;




const commonCustomerRoute = `${BACKEND_ROUTES}/admin/customer`;
const commonCustomerDetailRoute = `${BACKEND_ROUTES}/admin/customer/detail`;







const ROUTES = {
    loginRoute, logoutRoute, registerRoute, forgotPasswordRoute, passwordUpdateRoute,
    commonProductRoute, commonProductVariationRoute, getLatestProduct,
    commonCheckoutRoute, postGOTOCheckoutRoute,

    
    commonCustomerRoute, commonCustomerDetailRoute,
}

export default ROUTES