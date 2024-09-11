import { startTransition, useEffect, useState } from 'react'
import { useAuthContext } from '../context/authContext'
import { useCart } from '../context/cartContext'
import useAxioRequests from '../function/axioRequest'
import ROUTES from '../util/routes'

const useOrder = () => {
    const { userID, userData, setUserData }  = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests()
    const { isOpen, setISOpen } = useCart();

    const [loading, setLoading] = useState({ productList: true })
    const [productList, setProductList] = useState([]);
    
    useEffect(() => {
        loading.productList && handleGetRequest(ROUTES.commonProductRoute, 'productList')
    }, [loading.productList])

    async function handleGetRequest(route, mode){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                setProductList(response.data)
            })
        }
    }

    // Handle GoTo Checkout
    async function handleGoToCheckout(){
        if(userData?.cart?.length > 0){
            const response = await HandlePostRequest({
                data: {userID: userID, orderData: userData.cart},
                route: ROUTES.postGOTOCheckoutRoute,
                type: 'post',
                toastDescription: 'Proceed to Checkout'
            });

            if(response?.status === 200) window.location.href = '../checkout';
        }
    }

    // Handle Add to cart
    async function handleAddtoCart(productID, variationID, hasVariation, mode, toggleModal = true) {
        if (userID) {
            if (productList?.length > 0) {
                const product = productList.find(product => product.id.toString() === productID.toString());
                const selectedVariation = hasVariation && product?.variationData?.find(variation => variation._id.toString() === variationID.toString());
    
                const stockQty = hasVariation ? selectedVariation?.stock : product?.stock;
    
                // Ensure stock exists for either the product or the variation
                if (stockQty > 0) {
                    toggleModal && setISOpen(!isOpen);
                    let prevCart = [...(userData?.cart?.length > 0 ? userData?.cart : [])];
    
                    // Find the index based on whether the product has a variation
                    const foundIndex = hasVariation 
                        ? prevCart.findIndex(item => item.variationID === variationID)
                        : prevCart.findIndex(item => item.productId === productID);
    
                    if (foundIndex !== -1) {
                        if (mode === 'Add') {
                            prevCart[foundIndex].productQuantity = 
                                prevCart[foundIndex].productQuantity < Number(stockQty) 
                                    ? prevCart[foundIndex].productQuantity + 1 
                                    : prevCart[foundIndex].productQuantity;
                        } else {
                            if (prevCart[foundIndex].productQuantity > 1) {
                                prevCart[foundIndex].productQuantity -= 1;
                            } else {
                                prevCart = hasVariation 
                                    ? prevCart.filter(item => item.variationID !== variationID)
                                    : prevCart.filter(item => item.productId !== productID);
                            }
                        }
                    } else {
                        // Handle the case when no matching product/variation is found in the cart
                        const newItem = {
                            id: crypto.randomUUID(),
                            productId: product.id,
                            productName: product.productName,
                            productTax: product.productTax,
                            coverImage: product.coverImage,
                            isVariation: hasVariation,
                            variationID: variationID,
                            productQuantity: 1,
                            productPrice: hasVariation ? selectedVariation?.sellingPrice : product.sellingPrice
                        };
    
                        prevCart.push(newItem);
                    }
    
                    // Update the cart state
                    startTransition(() => {
                        setUserData(prev => ({ ...prev, cart: prevCart }));
                    });
                }
            }
        } else {
            window.location.href = '../get-started';
        }
    }
    
    return {
        handleAddtoCart,
        handleGoToCheckout,
        userData
    }
}

export default useOrder