import React, {useEffect} from 'react'
import useCustomerDetail from '../../hooks/admin/useCustomerDetail'
import { useParams } from 'react-router-dom'

const CustomerDetail = () => {
    const {id} = useParams();
    const {customerDetails} = useCustomerDetail(id)

    useEffect(() => {
      console.log(id)
    }, [id])
    
    return (
        <div>CustomerDetail</div>
    )
}

export default CustomerDetail