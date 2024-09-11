import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useCoupon = () => {
    const { userID } = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [couponList, setCouponList] = useState([])
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
        id: '',
    });
   
    useLayoutEffect(() => {
        if(!userID) navigate('../login')
    }, [userID])

    useEffect(() => {
        userID !== '' && loading.list && handleGetRequest(ROUTES.commonCouponRoute, 'list')
    }, [loading.list, userID])

    // Filter Product List
    useEffect(() => {
        if(couponList?.length > 0){
            let tempList = couponList;
            if(searchText !== ''){
                tempList = tempList.filter(coupon => String(coupon.code).toLowerCase().includes(searchText.toLowerCase()))
            }

            if(filterDate.stDate !== '' ){
                const stDate = new Date(filterDate.stDate);
                stDate.setHours(0,0,0,0);
                tempList = tempList.filter(coupon => {
                    const couponStDate = new Date(coupon.startDate);
                    couponStDate.setHours(0,0,0,0);
                    return couponStDate >= stDate
                })
            }

            if(filterDate.edDate !== '' ){
                const edDate = new Date(filterDate.edDate);
                edDate.setHours(0,0,0,0);
                tempList = tempList.filter(coupon => {
                    const couponEdDate = new Date(coupon.createdAt);
                    couponEdDate.setHours(0,0,0,0);
                    return couponEdDate <= edDate
                })
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [couponList, searchText, filterDate.edDate, filterDate.stDate])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setCouponList(response.data)
            })
        }
    }

    // Handle Product Status Update
    async function handleCouponStatusUpdate(id, value) {
        const response = await HandlePostRequest({
            data: {couponID: id, value: value},
            route: `${ROUTES.commonCouponRoute}/${id}`,
            type: 'put',
            toastDescription: `Coupon has ${value ? 'Activated' : 'InActivate'} successfully!`
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
            })
        }
    }

    // Handle Deletion
    async function handleCouponDeletion(id) {
        const response = await HandlePostRequest({
            data: {couponID: id},
            route: `${ROUTES.commonCouponRoute}/${id}`,
            type: 'delete',
            toastDescription: `Coupon has deleted successfully!`
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
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
    handleCouponStatusUpdate,
    handleCouponDeletion
  }
}

export default useCoupon