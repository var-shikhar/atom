import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import useAxioRequests from '../function/axioRequest';
import ROUTES from '../util/routes';

const modeType = [
    {
        id: 2,
        title: 'Login',
        slug: 'login'
    },
    {
        id: 1,
        title: 'Create an account',
        slug: 'signup'
    },
    {
        id: 3,
        title: 'Forgot Password',
        slug: 'forgot-password'
    }
]

const useGetStarted = () => {
    const { userID, setUserID, setUserData } = useAuthContext();
    const navigate = useNavigate();
    const { HandlePostRequest, HandleGetRequest } = useAxioRequests();
    const [loading, setLoading] = useState(true)
    const [productList, setProductList] = useState([]);

    useLayoutEffect(() => {
        if(userID !== undefined && userID !== '' && userID !== null) {
            navigate('../product')
        }
    }, [userID]);

    useEffect(() => {
        loading && handleGetRequest(ROUTES.commonProductRoute)
    }, [loading])

    async function handleGetRequest(route){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(false);
                setProductList(response.data)
            })
        }
    }

    async function handleAuthenticationForms(values, mode) {
        const response = await HandlePostRequest({
            data: values,
            route: mode === 'Login' ? ROUTES.loginRoute : ROUTES.registerRoute,
            type: 'post',
            toastDescription: `User has ${mode === 'Login' ? 'logged-in' : 'registered'} successfully!`,
        })

        if (response?.status === 200) {
            // wishlist
            const { userEmail, userID, userName, userPhone, cart } = response?.data;

            const latestCartValue = JSON.parse(localStorage.getItem('localCart')) || [];
            console.log(latestCartValue)
            const finalCartValue = latestCartValue?.length <= 0 ? cart : latestCartValue;

            let userDetails = {
                userID: userID,
                userName: userName,
                userEmail: userEmail,
                userPhone: userPhone,
                cart: []
            };
        
            if (finalCartValue?.length > 0) {
                const updatedCart = finalCartValue.map(item => {
                    const product = productList?.find(product => product.id.toString() === item.productId.toString());
        
                    // Ensure the product and variation exist
                    if (!product) {
                        console.warn(`Product with ID ${item.productId} not found`);
                        return null; 
                    }
        
                    const selectedVariation = item.isVariation 
                        ? product.variationData?.find(variation => variation._id.toString() === item.variationID.toString()) 
                        : null;
        
                    return {
                        id: crypto.randomUUID(),
                        productId: item.productId,
                        productName: product.productName || 'Unknown Product',
                        coverImage: product.coverImage || 'default-image-url',
                        isVariation: item.isVariation,
                        variationID: item.variationID,
                        productQuantity: item.productQuantity,
                        productPrice: item.isVariation 
                            ? selectedVariation?.sellingPrice || product.sellingPrice 
                            : product.sellingPrice || 0
                    };
                }).filter(Boolean);
                
                userDetails.cart = updatedCart;
            }
            startTransition(() => {
                setUserID(userID);
                setUserData(userDetails);
            });
        
            navigate('../product');
        }       
    }

    async function handlePasswordReset(values, mode) {
        const response = await HandlePostRequest({
            data: values,
            route: mode === 'ForgotPassword' ? ROUTES.forgotPasswordRoute : ROUTES.passwordUpdateRoute,
            type: 'post' ,
            toastDescription: mode === 'ForgotPassword' ? `Password Reset link has been sent successfully!` : 'Password has updated successfully!',
        })

        if(response?.status === 200) {
            navigate('../get-started');
            window.location.reload();
        }        
        return response
    }

    return {
        modeType,
        handleAuthenticationForms,
        handlePasswordReset
    }
}

export default useGetStarted