import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../../../function/axioRequest';
import ROUTES from '../../../util/routes';

const useCouponForm = (id = '') => {
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();
    const [loading, setLoading] = useState(true);
    const [defaultValue, setDefaultValues] = useState({
        id: id,
        couponCode: '',
        discountType: '',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscountedAmount: 0,
        expirationDate: '',
        limitUsage: 0,
        isActive: false,      
        startDate: new Date().toISOString().split('T')[0]
    });

    
    useEffect(() => {
        loading && handleGetRequest(`${ROUTES.commonCouponRoute}/${id}`)
    }, [loading, id]);


    // Handle Get Requests
    async function handleGetRequest(route) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false);
                setDefaultValues(prev => ({...prev, ...response.data}))
            })
        }
    }

    // Handle Form Submission
    async function handleFormSubmisstion(values, handleConfirmation){
        const response = await HandlePostRequest({
            route: ROUTES.commonCouponRoute,
            type: id === '' ? 'post' : 'put',
            data: values,
            toastDescription: `Coupon has ${id === '' ? 'created' : 'updated'} successfully!`
        });
        if (response?.status === 200) handleConfirmation();
    }

    return {
        defaultValue,
        handleFormSubmisstion
    }
}

export default useCouponForm