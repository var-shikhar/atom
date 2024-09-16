import { startTransition, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'
import useAxioRequests from '../function/axioRequest'
import ROUTES from '../util/routes'

const checkoutSteps = [
    {
        id: 1,
        name: 'User Details',
        slug: 'user-details'
    },
    {
        id: 2,
        name: 'Review & Submit',
        slug: 'review'
    },
    {
        id: 3,
        name: 'Payment Completion',
        slug: 'payment'
    },
]

const useCheckout = () => {
    const { userID, userData, setUserData }  = useAuthContext()
    const navigate = useNavigate()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests()
    const [loading, setLoading] = useState({
        shipping: true,
        initValues: true,
        isValidCoupon: false,
        isVerifying: false,
        paymentMade: false,
    })

    const [couponCode, setCouponCode] = useState('');
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [activeStep, setActiveStep] = useState(checkoutSteps[0].slug)
    const [orderDetails, setOrderDetails] = useState({
        buyerName: '',
        orderID: '',
        orderAmount: '',
        paymentMode: '',
    });
    const [defaultValues, setDefaultValues] = useState({
        userID: '',
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        bilingAddress: '',
        isSimilar: false,
        shippingAddress: '',
        city: '',
        stateID: '',
        zipCode: '',
        countryID: '',
    })
    const [submissionData, setSubmissionData]= useState({
        subTotal: 0,
        totalTax: 0,
        totalAmount: 0,
        hasDiscount: false,
        discountCode: couponCode,
        discount: 0,
        finalAmount: 0,
        products: userData.cart,
    });


    // Validate Checkout Page for any False Order (Empty Cart)
    useLayoutEffect(() => {
        if(!userID){
            navigate('../product')
        } 
    }, [userID])
    
    useEffect(() => {
        loading.shipping && handleGetRequest(ROUTES.commonCheckoutRoute, 'shipping')
    }, [loading.shipping])

    // Set Default Address Details
    useEffect(() => {
        if(loading.initValues && userID !== ''){
            startTransition(() => {
                setLoading(prev => ({...prev, initValues: false}));
                setDefaultValues(prev => ({
                    ...prev,
                    userID: userData.userID,
                    buyerName: userData.userName,
                    buyerPhone: userData.userPhone,
                    buyerEmail: userData.userEmail,
                }))
            })
        }
    }, [loading.initValues, userID])

    // Set Other Order Details
    useEffect(() => {
        if(userData?.cart?.length > 0){
            let totalObj = {
                subTotal: 0,
                totalTax: 0,
                totalAmount: 0,
                finalAmount: 0,
            };

            userData?.cart.forEach(item => {
                const productTax = item.productPrice * (item.productTax / 100);
                totalObj.subTotal += item.productPrice * item.productQuantity;
                totalObj.totalTax += productTax * item.productQuantity;
            });

            const tempTotalAmount =  totalObj.subTotal + totalObj.totalTax;
            totalObj.totalAmount = tempTotalAmount;
            totalObj.finalAmount = tempTotalAmount;

            startTransition(() => {
                setSubmissionData(prev => ({
                    ...prev,
                    subTotal: totalObj.subTotal,
                    totalTax: totalObj.totalTax,
                    totalAmount: totalObj.totalAmount,
                    finalAmount: totalObj.finalAmount,
                }))
            })
        }
    }, [userData])

    // Get Requests
    async function handleGetRequest(route, mode){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                setStateList(response.data.stateList);
                setCountryList(response.data.countryList)
            })
        }
    }

    // Handle Checkout
    async function handleCheckout(values){
        if(userData?.cart?.length > 0){
            const finalOBJ = {...values, ...submissionData};
            finalOBJ.discountCode = couponCode;
            const response = await HandlePostRequest({
                data: finalOBJ,
                route: ROUTES.commonCheckoutRoute,
                type: 'post',
                toastDescription: 'Order has placed successfully!'
            });

            if(response?.status === 200) {
                const {buyerName, orderID, orderMode, totalAmount} = response.data
                startTransition(() => {
                    setUserData(prev => ({...prev, cart: []}))
                    setActiveStep(checkoutSteps[2].slug)
                    setOrderDetails(prev => ({...prev, buyerName: buyerName, orderID: orderID, paymentMode: orderMode, orderAmount: totalAmount}))
                })
            }
        }
    }

    // Handle Payment Confirmation
    async function handlePaymentConfirmation(){
        const response = await HandlePostRequest({
            data: orderDetails,
            route: ROUTES.commonCheckoutRoute,
            type: 'put',
            toastDescription: 'Payment has processed successfully!'
        });

        if(response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, paymentMade: true}));
            })
        }
    }

    // Handle Coupon Validation
    async function handleCouponValidation() {
        setLoading(prev => ({...prev, isVerifying: true}));
        let rtnObj = {
            hasDiscount: false,
            discount: 0, 
            finalAmount: submissionData.totalAmount
        }
        const response = await HandlePostRequest({
            route: ROUTES.postGOTOCheckoutRoute,
            data: {code: couponCode, totalAmount: submissionData.totalAmount},
            type: 'put',
            toastDescription: 'Coupon has applied successfully!'
        })
        setLoading(prev => ({...prev, isVerifying: false}));
        if(response?.status === 200){
            const { discount, finalAmount } = response.data;
            startTransition(() => {
                setLoading(prev => ({...prev, isValidCoupon: true}));
                rtnObj = {
                    hasDiscount: true,
                    discount: discount, 
                    finalAmount: finalAmount
                };
            })
        }

        startTransition(() => {
            setSubmissionData(prev => ({
                ...prev, 
                hasDiscount: rtnObj.hasDiscount,
                discount: rtnObj.discount, 
                finalAmount: rtnObj.finalAmount
            }))
        })

    }

    // Handle Coupon Editing
    async function handleReEditCoupon() {
        startTransition(() => {
            setLoading(prev => ({...prev, isValidCoupon: false, isVerifying: false}))
            setSubmissionData(prev => ({...prev, hasDiscount: false, discount: 0, finalAmount: prev.totalAmount}))
        })
    }
    
    return {
        checkoutSteps,
        activeStep, 
        defaultValues,
        stateList,
        countryList,
        userData,
        couponCode, 
        loading,
        submissionData,
        orderDetails,
        setCouponCode,
        setOrderDetails,
        handleCheckout,
        setActiveStep,
        handleCouponValidation,
        handleReEditCoupon,
        handlePaymentConfirmation,
    }
}

export default useCheckout