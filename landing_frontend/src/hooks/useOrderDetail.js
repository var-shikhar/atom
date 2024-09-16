import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import useAxioRequests from '../function/axioRequest';
import ROUTES from '../util/routes';

const useOrderDetail = (orderID = '') => {
    const { userID } = useAuthContext();
    const { HandleGetRequest } = useAxioRequests();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        text: '',
        imageURL: '',
        mode: '',
        orderID: '',
        productID: '',
        size: '',
        title: '',
    })
    const [orderDetail, setOrderDetail] = useState({});

    // Check Page for Authentication
     useLayoutEffect(() => {
        if(!userID){
            navigate('../product')
        }
    }, [userID])

    // Fetch Order List
    useEffect(() => {
        loading && orderID !== '' && handleGetRequest(`${ROUTES.commonMyOrderRoute}/${orderID}`)
    }, [loading, orderID])


    // Get Axios Requests
    async function handleGetRequest(route){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            console.log(response.data)
            startTransition(() => {
                setLoading(false);
                setOrderDetail(response.data)
            })
        }
    }

    // Handle Confirmation
    async function handleConfirmation() {
        startTransition(() => setLoading(true))
    }

    // Handle Navigation
    function handleNavigation(){
        navigate(`../my-orders`)
    }



  return {
    orderDetail,
    modalToggle, 
    modalData,
    setModalToggle,
    setModalData,
    handleNavigation,
    handleConfirmation,
  }
}

export default useOrderDetail