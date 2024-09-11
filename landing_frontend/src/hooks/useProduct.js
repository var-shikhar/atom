import { startTransition, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import useAxioRequests from '../function/axioRequest';
import ROUTES from '../util/routes';

const useProduct = () => {
    const { userData }  = useAuthContext()
    const { HandleGetRequest } = useAxioRequests();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        loading && handleGetRequest(ROUTES.commonProductRoute)
    }, [loading])

    async function handleGetRequest(route){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(false)
                setProductList(response.data)
            })
        }
    }

    function handleProductNavigation(id){
        navigate(`../product/${id}`)
    }
    
    return {
        userData,
        productList,
        handleProductNavigation,
    }
}

export default useProduct