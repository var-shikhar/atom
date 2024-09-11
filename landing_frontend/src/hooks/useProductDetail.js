import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../function/axioRequest';
import ROUTES from '../util/routes';
import useOrder from './useOrder';

const useProductDetail = (id = '') => {
    const { HandleGetRequest } = useAxioRequests();
    const { userData, handleAddtoCart } = useOrder();

    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetail] = useState(null);
    const [variationList, setVariationList] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({
        id: '',
        variationID: '',
        hasVariation: false,
        mrp: 0,
        sellingPrice: 0,
        images: [],
        SKU: '',
        stock: 0,
    });


    useEffect(() => {
        if(id !== ''){
            loading && handleGetRequest(`${ROUTES.commonProductRoute}/${id}`)
        }
    }, [loading, id])

    useEffect(() => {
        if(productDetail !== null){
            let tempProduct ;
            if(!productDetail.isVariationProduct){
                tempProduct = {
                    id: productDetail._id,
                    variationID: '',
                    hasVariation: false,
                    mrp: productDetail.baseMRPPrice,
                    sellingPrice: productDetail.baseSellingPrice,
                    images: productDetail.images,
                    SKU: productDetail.baseSku,
                    stock: productDetail.baseStock,
                }
                
                startTransition(() => {
                    setSelectedProduct(tempProduct);
                })
            } else {
                let variationType = [];
                productDetail.variations?.forEach(item => {
                    variationType.push(item.value)
                });

                startTransition(() => {
                    setVariationList(variationType)
                })
            }
        }
    }, [loading, id])

    async function handleGetRequest(route){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(false)
                setProductDetail(response.data)
            })
        }
    }


    return {
        productDetail,
        variationList,
    }
}

export default useProductDetail