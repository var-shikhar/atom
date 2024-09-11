import React, { useState, useEffect, startTransition } from 'react'
import ROUTES from '../util/routes'
import useAxioRequests from '../function/axioRequest'

const OrderDetail = ({id = ''}) => {
  const { HandleGetRequest } = useAxioRequests();
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState({})

  useEffect(() => {
    loading && id !== '' && handleGetRquest(`${ROUTES.commonOrderRoute}/${id}`)
  }, [loading, id]);

  // Fetch Lists from Server
  async function handleGetRquest(route) {
    const response = await HandleGetRequest(route);
    if (response?.status === 200) {
      startTransition(() => {
        setLoading(false);
        setOrderDetails(response.data)
      })
    }
  }

  return (
    <div>OrderDetail</div>
  )
}

export default OrderDetail