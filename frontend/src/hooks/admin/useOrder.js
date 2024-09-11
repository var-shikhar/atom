import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useOrder = () => {
    const { userID } = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [orderList, setOrderList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    const [searchText, setSearchText] = useState('')
    const [filterDate, setFilterDate] = useState({
        stDate: '',
        edDate: '',
    })
    const [modalToggle, setModalToggle] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [modalData, setModalData] = useState({
        title: '',
        size: '',
        orderID: '',
        mode: '',
    });

   
    useLayoutEffect(() => {
        if(userID === '' || userID === undefined) navigate('../login')
    }, [userID])

    useEffect(() => {
        userID !== '' && loading.list && handleGetRequest(ROUTES.commonOrderRoute, 'list')
    }, [loading.list, userID])

    // Filter Product List
    useEffect(() => {
        if(orderList?.length > 0){
            let tempList = orderList;
            if(searchText !== ''){
                tempList = tempList.filter(order => String(order.buyerName).toLowerCase().includes(searchText.toLowerCase()) || String(order._id).toLowerCase().includes(searchText.toLowerCase()))
            }

            if(filterDate.stDate !== '' ){
                const stDate = new Date(filterDate.stDate);
                stDate.setHours(0,0,0,0);
                tempList = tempList.filter(order => {
                    const oDate = new Date(order.createdAt);
                    oDate.setHours(0,0,0,0);
                    return oDate >= stDate
                })
            }

            if(filterDate.edDate !== '' ){
                const edDate = new Date(filterDate.edDate);
                edDate.setHours(0,0,0,0);
                tempList = tempList.filter(order => {
                    const oDate = new Date(order.createdAt);
                    oDate.setHours(0,0,0,0);
                    return oDate <= edDate
                })
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [orderList, searchText, filterDate.edDate, filterDate.stDate])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setOrderList(response.data)
            })
        }
    }

    // Handle Request Confirmation
    function handleConfirmation() { 
        startTransition(() => {
            setLoading(prev => ({...prev, list: true}))
            setModalToggle(!modalToggle);
        })
    }

    // Handle Table Sorting
    function handleTableSorting(key){
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const tempSortedUsers = [...filteredList].sort((a, b) => {
            if (sortConfig.key) {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
            }
            return 0;
        });

        startTransition(() => {
            setFilteredList(tempSortedUsers)
        })
    }

    return {
        filteredList,
        searchText,
        modalToggle,
        modalData, 
        filterDate, 
        setFilterDate,
        setModalToggle,
        setModalData,
        setSearchText,
        handleConfirmation,
        handleTableSorting,
    }
}

export default useOrder