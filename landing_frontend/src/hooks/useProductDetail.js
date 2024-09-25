import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../function/axioRequest';
import ROUTES from '../util/routes';
import useOrder from './useOrder';

const useProductDetail = (id = '') => {
    const { HandleGetRequest } = useAxioRequests();
    const { userID, userData, handleAddtoCart, handleWishListItems } = useOrder();

    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetail] = useState(null);
    const [variationList, setVariationList] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [localCart, setLocalCart] = useState(JSON.parse(localStorage.getItem('localCart')) || []);

    const [baseDetails, setBaseDetails] = useState({
        isVariation: false,
        userImages: [],
        hasItem: null,
        isWishListed: false,
        variType: '',
    });

    useEffect(() => {
        if(id !== '' && loading) handleGetRequest(`${ROUTES.commonProductRoute}/${id}`)
    }, [loading, id])

    useEffect(() => {
        if(productDetail !== null){
            let tempProduct = null;
            let variationType = [];
            let tempBaseDetail = {
                isVariation: false,
                userImages: [],
                variType: '',
            };

            if(!productDetail.isVariationProduct){
                tempBaseDetail = {
                    isVariation: false,
                    userImages: productDetail.images,
                    variType: '',
                }

                tempProduct = {
                    productID: productDetail._id,
                    variationID: '',
                    mrprice: productDetail.baseMRPPrice,
                    sellingPrice: productDetail.baseSellingPrice,
                    productSKU: productDetail.baseSku,
                    productStock: productDetail.baseStock,
                }
            } else { 
                tempBaseDetail = {
                    isVariation: true,
                    userImages: productDetail.images,
                    variType: ''
                }

                productDetail.variations?.forEach(item => {
                    variationType.push({value: item.value, isAvailable: item.isAvailable})
                });
            }

            startTransition(() => {
                setSelectedProduct(tempProduct);
                setBaseDetails(prev => ({...prev, ...tempBaseDetail}))
                setVariationList(variationType)
            })
        }
    }, [loading, id])


    // Listen for storage changes (to handle updates across tabs)
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedCart = JSON.parse(localStorage.getItem('localCart')) || [];
            setLocalCart(updatedCart);
        };

        // Listen for the custom event
        window.addEventListener('localCartUpdated', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
            window.removeEventListener('localCartUpdated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    // Default Product Selection and Updation 
    useEffect(() => {
        if(selectedProduct !== null){
            // Check Cart Item
            const cart = userID && userData?.cart ? userData.cart : localCart;
            let hasItem = cart.find(item => baseDetails.isVariation ? item.variationID === selectedProduct.variationID : item.productId === selectedProduct.productID) || null;
            
            // Check WishList Item
            const wishList = userID && userData?.wishList ? userData.wishList : [];
            let hasWishListItem = wishList.find(item => baseDetails.isVariation ? item.variationID === selectedProduct.variationID : item.productId === selectedProduct.productID) || null;

            // const hasWishListItem = wishList.find(item => item.productId === product.id);
            startTransition(() => {
                setBaseDetails(prev => ({...prev, hasItem: hasItem, isWishListed: hasWishListItem ? true : false}))
            })      
        }
    }, [selectedProduct, userID, userData, localCart])

    // Handle Get Requests
    async function handleGetRequest(route){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(false)
                setProductDetail(response.data)
            })
        }
    }

    // Handle Product Selection
    function handleProductSelect(selectedProduct){
        if(baseDetails.isVariation && productDetail.variations?.length > 0){
            const foundProduct = productDetail.variations?.find(product => product.value === selectedProduct)
            if(foundProduct){
                const tempImages = foundProduct?.images?.length > 0 ? foundProduct?.images : baseDetails.userImages;
                const tempProduct = {
                    productID: productDetail._id,
                    variationID: foundProduct._id,
                    mrprice: foundProduct.mrpPrice,
                    sellingPrice: foundProduct.sellingPrice,
                    productSKU: foundProduct.sku,
                    productStock: foundProduct.stock,
                }
                startTransition(() => {
                    setBaseDetails(prev => ({...prev, userImages: tempImages, variType: foundProduct.value }));
                    setSelectedProduct(tempProduct)
                    setSelectedOption(selectedProduct)
                })

            }
        }
    }

    return {
        userID,
        productDetail,
        variationList,
        selectedProduct,
        baseDetails,
        selectedOption, 
        setSelectedOption,
        handleProductSelect,
        handleWishListItems,
        handleAddtoCart,
    }
}

export default useProductDetail