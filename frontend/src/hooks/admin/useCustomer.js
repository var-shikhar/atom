import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useCustomer = () => {
    const { userID } = useAuthContext()
    const { HandleGetRequest } = useAxioRequests();
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [customerList, setCustomerList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    const [searchText, setSearchText] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
   
    useLayoutEffect(() => {
        if(userID === '' || userID === undefined) navigate('../login')
    }, [userID])

    useEffect(() => {
        userID !== '' && loading.list && handleGetRequest(ROUTES.commonCustomerRoute, 'list')
    }, [loading.list, userID])

    // Filter Customer List
    useEffect(() => {
        if(customerList?.length > 0){
            let tempList = customerList;
            if(searchText !== ''){
                tempList = tempList.filter(customer => String(customer.name).toLowerCase().includes(searchText.toLowerCase()))
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [customerList, searchText])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setCustomerList(response.data)
            })
        }
    }

    // Handle Product Status Update
    async function handleCustomerDetail(customerID) {
        navigate(`../customer/${customerID}/detail`)
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
        setSearchText, 
        handleCustomerDetail,
        handleTableSorting
    }
}

export default useCustomer