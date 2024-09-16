import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const useContactLead = () => {
    const { userID } = useAuthContext()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();
    const navigate = useNavigate()
    const [loading, setLoading] = useState({
        list: true,
    })

    const [contactLeadList, setContactLeadList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [modalToggle, setModalToggle] = useState(false)
    const [modalData, setModalData] = useState({
        id: ''
    })

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchText, setSearchText] = useState('')
    const [filterDate, setFilterDate] = useState({
        stDate: '',
        edDate: '',
    })

    useLayoutEffect(() => {
        if(!userID) navigate('../login')
    }, [userID])

    useEffect(() => {
        loading.list && handleGetRequest(ROUTES.commonContactLeadRoute, 'list')
    }, [loading.list])

    // Filter Product List
    useEffect(() => {
        if(contactLeadList?.length > 0){
            let tempList = contactLeadList;
            if(searchText !== ''){
                tempList = tempList.filter(lead => lead.userName.toLowerCase().includes(searchText.toLowerCase()))
            }

            if(filterDate.stDate !== '' ){
                const stDate = new Date(filterDate.stDate);
                stDate.setHours(0,0,0,0);
                tempList = tempList.filter(lead => {
                    const leadStDate = new Date(lead.createdAt);
                    leadStDate.setHours(0,0,0,0);
                    return leadStDate >= stDate
                })
            }

            if(filterDate.edDate !== '' ){
                const edDate = new Date(filterDate.edDate);
                edDate.setHours(0,0,0,0);
                tempList = tempList.filter(lead => {
                    const leadEdDate = new Date(lead.createdAt);
                    leadEdDate.setHours(0,0,0,0);
                    return leadEdDate <= edDate
                })
            }

            startTransition(() => {
                setFilteredList(tempList);
            })
        }
    }, [contactLeadList, searchText, filterDate.edDate, filterDate.stDate])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                setContactLeadList(response.data)
            })
        }
    }

    // Handle Deletion
    async function handleContactLeadDeletion(id) {
        const response = await HandlePostRequest({
            data: {leadID: id},
            route: `${ROUTES.commonContactLeadRoute}/${id}`,
            type: 'delete',
            toastDescription: `Contact Lead has deleted successfully!`
        });

        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, list: true}))
            })
        }
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

    // Handle Request Confirmation
    function handleConfirmation() { 
        startTransition(() => {
            setLoading(prev => ({...prev, list: true}))
            setModalToggle(!modalToggle);
        })
    }

  return {
    filteredList,
    searchText, 
    filterDate, 
    modalToggle, 
    modalData,
    setModalToggle,
    setModalData,
    setFilterDate,
    setSearchText,
    handleTableSorting,
    handleContactLeadDeletion,
    handleConfirmation
  }
}

export default useContactLead