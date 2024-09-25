import { startTransition, useEffect, useState } from 'react'
import { useAuthContext } from '../context/authContext'
import { useCart } from '../context/cartContext'
import useAxioRequests from '../function/axioRequest'
import ROUTES from '../util/routes'
import { useWishList } from '../context/wishlistContext'

const useOrder = () => {
    const { userID, userData, setUserData }  = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests()
    const { isOpen, setISOpen } = useCart();
    const { wISOpen, setWISOpen } = useWishList();

    const [loading, setLoading] = useState({ productList: true })
    const [productList, setProductList] = useState([]);
    
    useEffect(() => {
        loading.productList && handleGetRequest(ROUTES.commonProductRoute, 'productList')
    }, [loading.productList])


    // Handle Get Requests
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

    // Validate Cart Items
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
    // Validate Cart Items
    async function validateWishlistItems() {
        if (!userData?.wishList?.length || !productList?.length) {
            return [];
        }

        const validWishList = userData.wishList.filter(item => {
            const productInCart = productList.find(product => product.id.toString() === item.productId.toString());            
            if (!productInCart) return false;

            // If the item has a variation, ensure that the variation exists
            const variation = item?.isVariation && productInCart?.variationData?.find(variation => variation._id.toString() === item.variationID.toString());
            // Return true if the product exists (with or without variation), stock doesn't matter
            return item.isVariation ? !!variation : !!productInCart;
        });
    
        startTransition(() => setUserData(prev => ({ ...prev, wishList: validWishList })));
    
        return validWishList;
    }
    
    // Handle Add to cart
    async function handleAddtoCart(productID, variationID, hasVariation, variType = '', mode, toggleModal = true) {
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
                cart.push({
                    id: crypto.randomUUID(),
                    productId: product.id,
                    productName: product.productName,
                    productTax: Number(product.productTax),
                    coverImage: product.coverImage,
                    isVariation: hasVariation,
                    variationID: variationID,
                    variationType: variType,
                    productQuantity: 1,
                    productPrice: hasVariation ? Number(selectedVariation?.sellingPrice) : Number(product.sellingPrice)
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
                window.dispatchEvent(new Event('localCartUpdated'));
            }
        } else if (!isLoggedIn) {
            window.location.href = '../get-started';
        }
    }
    // Handle WishList Items
    async function handleWishListItems(productID, hasVariation, variationID, toggleModal = true) {
        const isLoggedIn = Boolean(userID);
        let wishList = await validateWishlistItems() || [];
    
        const product = productList?.find(product => product.id.toString() === productID.toString());
        const selectedVariation = hasVariation && product?.variationData?.find(variation => variation._id.toString() === variationID.toString());
    
        if (product && isLoggedIn) {
            const foundIndex = hasVariation 
                ? wishList.findIndex(item => item.variationID === variationID) 
                : wishList.findIndex(item => item.productId === productID);
    
            if (foundIndex !== -1) {
                // If the item exists in the wishlist, remove it
                wishList.splice(foundIndex, 1);
            } else {
                // Add new item to the wishlist
                wishList.push({
                    id: crypto.randomUUID(),
                    productId: product.id,
                    productName: product.productName,
                    coverImage: selectedVariation && selectedVariation?.images?.length > 0 ? selectedVariation.images[0] : product.coverImage,
                    isVariation: hasVariation,
                    variationID: variationID,
                    variationType: selectedVariation ? selectedVariation.value : '',
                });
            }

            toggleModal && setWISOpen(!wISOpen);
            // Update wishlist based on login status
            startTransition(() => {
                setUserData(prev => ({ ...prev, wishList: wishList }));
                handleWishListBackend(productID, variationID, hasVariation, foundIndex !== -1 ? true : false)
            });
        } else if (!isLoggedIn) {
            // Redirect to get started page if not logged in
            window.location.href = '../get-started';
        }
    }
    

    async function handleWishListBackend(productID, variationID, isVariation, isRemoval) {                
        await HandlePostRequest({
            data: {productID, variationID, isVariation, isRemoval},
            route: ROUTES.commonWishListRoute,
            type: 'post',
            toastDescription: `Item has ${isRemoval ? 'removed' : 'added'} in Wishlist`
        });
    }

    // Move items from wishlist to cart
    async function handleMoveItemsToCart(productID, variationID, hasVariation) {
        const isLoggedIn = Boolean(userID);
    
        if (!isLoggedIn) {
            window.location.href = '../get-started'; 
            return; 
        }
    
        let cart = await validateCartItems() || [];
        let wishList = await validateWishlistItems() || [];
        
        const foundItemIndex = hasVariation 
            ? wishList.findIndex(item => item.variationID === variationID) 
            : wishList.findIndex(item => item.productId === productID);
    
        if (foundItemIndex !== -1) {
            const itemToMove = wishList[foundItemIndex];
            wishList.splice(foundItemIndex, 1); // Remove from wishlist
            
            const cartItemIndex = hasVariation 
                ? cart.findIndex(item => item.variationID === variationID) 
                : cart.findIndex(item => item.productId === productID);
    
            // If the item is already in the cart, do nothing
            if (cartItemIndex === -1) {
                const product = productList?.find(product => product.id.toString() === itemToMove.productId.toString());
                const selectedVariation = hasVariation && product?.variationData?.find(variation => variation._id.toString() === variationID.toString());
    
                cart.push({
                    id: crypto.randomUUID(),
                    productId: itemToMove.productId,
                    productName: itemToMove.productName,
                    productTax: Number(product.productTax),
                    coverImage: itemToMove.coverImage,
                    isVariation: hasVariation,
                    variationID: variationID,
                    variationType: itemToMove.variationType,
                    productQuantity: 1,
                    productPrice: hasVariation ? Number(selectedVariation?.sellingPrice) : Number(product.sellingPrice)
                });
            }
    
            startTransition(() => {
                setUserData(prev => ({ ...prev, cart, wishList }));
            });
    
            handleWishListBackend(itemToMove.productId, variationID, hasVariation, true); // Remove from wishlist
        } else {
            console.log('Item not found in the wishlist');
        }
    }
    
    
    
    return {
        userData,
        userID,
        handleAddtoCart,
        handleGoToCheckout,
        handleWishListItems,
        handleMoveItemsToCart
    }
}

export default useOrder