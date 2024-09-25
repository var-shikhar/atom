const BACKEND_ROUTES = 'https://atom-7y9m.onrender.com';
// const BACKEND_ROUTES = 'http://localhost:8081';


const loginRoute = `${BACKEND_ROUTES}/public/public/auth/login`;
const registerRoute = `${BACKEND_ROUTES}/public/public/auth/register`;
const forgotPasswordRoute = `${BACKEND_ROUTES}/public/public/auth/forgot-password`;
const passwordUpdateRoute = `${BACKEND_ROUTES}/public/public/auth/password-update`;
const logoutRoute = `${BACKEND_ROUTES}/public/public/auth/logout`;

const commonProductRoute = `${BACKEND_ROUTES}/public/public/product`;
const commonProductVariationRoute = `${BACKEND_ROUTES}/admin/product/variation`;
const getLatestProduct = `${BACKEND_ROUTES}/public/public/latest-product`;

const commonCheckoutRoute = `${BACKEND_ROUTES}/public/public/checkout`;
const commonWishListRoute = `${BACKEND_ROUTES}/public/public/wishlist`;
const postGOTOCheckoutRoute = `${BACKEND_ROUTES}/public/public/order`;

const commonMyOrderRoute = `${BACKEND_ROUTES}/public/public/my-order`;
const commonReviewRoute = `${BACKEND_ROUTES}/public/public/order-review`;




const commonCustomerRoute = `${BACKEND_ROUTES}/admin/customer`;
const commonCustomerDetailRoute = `${BACKEND_ROUTES}/admin/customer/detail`;


const commonContactRoute = `${BACKEND_ROUTES}/public/public/contact`;






const ROUTES = {
    loginRoute, logoutRoute, registerRoute, forgotPasswordRoute, passwordUpdateRoute,
    commonProductRoute, commonProductVariationRoute, getLatestProduct,
    commonCheckoutRoute, postGOTOCheckoutRoute,
    commonWishListRoute,
    commonMyOrderRoute, commonReviewRoute,
    commonContactRoute,
 
    
    commonCustomerRoute, commonCustomerDetailRoute,
}

export default ROUTES