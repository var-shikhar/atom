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
        if(userID){
            if(userData?.cart?.length > 0){
                const cartData = await validateCartItems();
                const response = await HandlePostRequest({
                    data: {userID: userID, orderData: cartData},
                    route: ROUTES.postGOTOCheckoutRoute,
                    type: 'post',
                    toastDescription: 'Proceed to Checkout'
                });

                if(response?.status === 200) window.location.href = '../checkout';
            } else {
                window.location.href = '../product'
            }
        } else {
            window.location.href = '../get-started'
        }
    }

    async function validateCartItems() {
        if (!userData?.cart?.length || !productList?.length) {
            return [];
        }
    
        const validCart = userData.cart.filter(item => {
            const productInCart = productList.find(product => product.id === item.productId);
            if (!productInCart) return false;
    
            const variation = item?.isVariation && productInCart?.variationData?.find(variation => variation._id === item.variationID);
            return item.isVariation ? variation?.stock > 0 : productInCart?.stock > 0;
        });
    
        // Update cart state
        startTransition(() => setUserData(prev => ({ ...prev, cart: validCart })));
    
        return validCart;
    }
    

    // Handle Add to cart
    async function handleAddtoCart(productID, variationID, hasVariation, mode, toggleModal = true) {
        const isLoggedIn = Boolean(userID);
        let cart = isLoggedIn ? await validateCartItems() : JSON.parse(localStorage.getItem('localCart')) || [];
    
        const product = productList?.find(product => product.id.toString() === productID.toString());
        const selectedVariation = hasVariation && product?.variationData?.find(variation => variation._id.toString() === variationID.toString());
        const stockQty = hasVariation ? selectedVariation?.stock : product?.stock;
    
        if (product && stockQty > 0) {
            const foundIndex = hasVariation 
                ? cart.findIndex(item => item.variationID === variationID)
                : cart.findIndex(item => item.productId === productID);
    
            // Update quantity or remove item
            if (foundIndex !== -1) {
                if (mode === 'Add') {
                    cart[foundIndex].productQuantity = cart[foundIndex].productQuantity < Number(stockQty) ? cart[foundIndex].productQuantity + 1 : cart[foundIndex].productQuantity;
                } else {
                    cart[foundIndex].productQuantity > 1
                        ? cart[foundIndex].productQuantity -= 1
                        : cart = hasVariation
                            ? cart.filter(item => item.variationID !== variationID)
                            : cart.filter(item => item.productId !== productID);
                }
            } else {
                // Add new item to the cart
                console.log(product)
                cart.push({
                    id: crypto.randomUUID(),
                    productId: product.id,
                    productName: product.productName,
                    productTax: product.productTax,
                    coverImage: product.coverImage,
                    isVariation: hasVariation,
                    variationID: variationID,
                    productQuantity: 1,
                    productPrice: hasVariation ? selectedVariation?.sellingPrice : product.sellingPrice
                });
            }
    
            // Update cart in the respective place
            toggleModal && setISOpen(!isOpen);
            if (isLoggedIn) {
                startTransition(() => {
                    setUserData(prev => ({ ...prev, cart }));
                });
            } else {
                localStorage.setItem('localCart', JSON.stringify(cart));
            }
        } else if (!isLoggedIn) {
            window.location.href = '../get-started';
        }
    }


    function handleMoveItemsToCart () {

    }
    
    return {
        handleAddtoCart,
        handleGoToCheckout,
        userData,
        handleMoveItemsToCart
    }
}

export default useOrder