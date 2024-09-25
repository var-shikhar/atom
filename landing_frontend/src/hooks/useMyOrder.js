import React, { startTransition, useEffect, useLayoutEffect, useState } from 'react'
import ROUTES from '../util/routes';
import useAxioRequests from '../function/axioRequest';
import { useAuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import CONSTANT from '../util/constant';

const {ORDER_STATUS} = CONSTANT;

const useMyOrder = () => {
    const { userID } = useAuthContext();
    const { HandleGetRequest } = useAxioRequests();
    const navigate = useNavigate();

    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        orderID: '',
        title: '',
        size: '',
        mode: '',
        productID: '',
        review: {
            text: '',
            imageURL: '',
            rating: 0,
        }
    })
    const [searchText, setSearchText] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterDate, setFilterDate] = useState({
        stDate: '',
        edDate: '',
    })

    const [loading, setLoading] = useState({
        list: true,
    });

    const [orderList, setOrderList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    // Check Page for Authentication
    useLayoutEffect(() => {
        if(!userID){
            navigate('../product')
        }
    }, [userID])

    // Fetch Order List
    useEffect(() => {
        loading.list && handleGetRequest(ROUTES.commonMyOrderRoute, 'list')
    }, [loading.list])

    // Initialize Filtered List and Use Search and Date Filters 
    useEffect(() => {
        if(orderList?.length > 0){
            let tempList = orderList;
            
            if(searchText !== ''){
                tempList = tempList.filter(item => item._id.toString().includes(searchText.toLowercase()))
            }

            if(filterDate.stDate !== ''){
                const ftStDate = new Date(filterDate.stDate);
                ftStDate.setHours(0,0,0,0);
                tempList = tempList.filter(item => {
                    const odDate = new Date(item.orderDate);
                    odDate.setHours(0,0,0,0);
                    return odDate >= ftStDate 
                })
            }

            if(filterDate.edDate !== ''){
                const ftEdDate = new Date(filterDate.edDate);
                ftEdDate.setHours(0,0,0,0);
                tempList = tempList.filter(item => {
                    const odDate = new Date(item.orderDate);
                    odDate.setHours(0,0,0,0);
                    return odDate <= ftEdDate 
                })
            }

            if(filterStatus !== ''){
                tempList = tempList.filter(item => item?.status === filterStatus)
            }

            startTransition(() => {
                setFilteredList(tempList)
            })
            
        }
    }, [orderList, searchText, filterDate, filterStatus])

    // Get Axios Requests
    async function handleGetRequest(route, mode){
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                setOrderList(response.data)
            })
        }
    }

    // Handle Order Details
    function handleOrderDetails(orderID){
        navigate(`../my-orders/${orderID}`)
    }

    // Handle Confirmation
    function handleConfirmation(){
        startTransition(() => {
            setLoading(prev => ({...prev, list: true}))
            setModalToggle(!modalToggle)
        });
    }

  return {
    searchText, 
    filterDate,
    filteredList,
    ORDER_STATUS,
    filterStatus,
    modalToggle, 
    modalData, 
    setModalData,
    setModalToggle,
    setSearchText,
    setFilterDate,
    setFilterStatus,
    handleOrderDetails,
    handleConfirmation,
  }
}

export default useMyOrder