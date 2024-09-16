import React, { startTransition, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import useAxioRequests from '../function/axioRequest'
import ROUTES from '../util/routes'

const OrderDetail = ({id = ''}) => {
  const { HandleGetRequest } = useAxioRequests();
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState({})

  useEffect(() => {
    loading && id !== '' && handleGetRquest(`${ROUTES.commonOrderDetailRoute}/${id}`)
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
    <div className='text-light overflow-y-scroll hidden-scrollbar'>
      <div className='row'>
        <div className='col-md-8 col-12'>
          <div className='fw-bold my-2 ps-md-2'>Buyer Details</div>
          <div className='border p-2 rounded shadow'>
            <div className='d-flex align-items-center'>
              <small className='w-50'>Buyer Name: </small>
              <div className='w-50'>: {orderDetails.buyerName}</div>
            </div>
            <div className='d-flex align-items-center'>
              <small className='w-50'>Buyer Email: </small>
              <div className='w-50'>: {orderDetails.buyerEmail}</div>
            </div>
            <div className='d-flex align-items-center'>
              <small className='w-50'>Buyer Contact No: </small>
              <div className='w-50'>: {orderDetails.buyerPhone}</div>
            </div>
            <div className='d-flex align-items-center'>
              <small className='w-50'>Buyer Name: </small>
              <div className='w-50'>: {orderDetails.buyerName}</div>
            </div>
            <div className='d-flex align-items-center'>
              <small className='w-50'>Buyer Address: </small>
              <div className='w-50'>:  
                {orderDetails.shippingAddress?.shippingAddress}, <br /> 
                {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.stateId?.name}, <br /> 
                {orderDetails.shippingAddress?.zipCode}, {orderDetails.shippingAddress?.countryId?.name}
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4 col-12'>
          <div className='fw-bold my-2 ps-md-2'>Order Amount</div>
            <div className='border p-2 rounded shadow'>
              <div className='d-flex align-items-center'>
                <small className='w-50'>Order Status: </small>
                <div className='w-50 fw-bold'>: {orderDetails.status}</div>
              </div>
              <div className='d-flex align-items-center'>
                <small className='w-50'>Order Total: </small>
                <div className='w-50'>: ₹ {orderDetails.totalAmount} /-</div>
              </div>
              <div className='d-flex align-items-center'>
                <small className='w-50'>Taxes: </small>
                <div className='w-50'>: ₹ {orderDetails.totalTax} /-</div>
              </div>
              <div className='d-flex align-items-center'>
                <small className='w-50'>SubTotal: </small>
                <div className='w-50'>: ₹ {orderDetails.totalAmount + orderDetails.totalTax} /-</div>
              </div>
              <div className='d-flex align-items-center'>
                <small className='w-50'>Discount: </small>
                <div className='w-50 text-danger'>: ₹ {orderDetails.discount} /-</div>
              </div>
              <div className='d-flex align-items-center fs-5 my-2 fw-bold border-top border-bottom'>
                <small className='w-50'>Final Amount: </small>
                <div className='w-50 text-success'>: ₹ {(orderDetails.totalAmount + orderDetails.totalTax) - orderDetails.discount} /-</div>
              </div>
            </div>
        </div>
      </div>
      <hr />
      <div className='row'>
        <div className='col-12 col-md-8'>
          <div className='fw-bold my-2'>Product List</div>
          {orderDetails?.products?.length > 0 ? 
            <div className='border p-2 rounded shadow w-100'>
              {orderDetails?.products.map(item => 
                <React.Fragment key={item._id}>
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <div className='d-flex'>
                      <img src={item.productImage} width={50} height={50} className='rounded'/>
                      <div className='ps-2'> 
                        <div className='text-truncate'>{item.productName}</div>
                        <span>{item.productSKU}</span> <span>{item.variationType}</span>
                      </div>
                    </div>
                    <div className='d-flex flex-column me-md-2'>
                      <div>{item.productQuantity} {item.productQuantity > 1 ? 'PCs' : 'PC'}</div>
                      <div>₹ {item.productPrice}/-</div>
                    </div>
                  </div>
                  <hr />
                </React.Fragment>
              )}
            </div> 
            : <div> No Product Found!</div>
          }
        </div>
        <div className='col-md-4 col-12'>
          <div className='fw-bold my-2 ps-md-2'>Order Feedback</div>
            <div className='border p-2 rounded shadow'>
              <div className=''>
                <small className=''>Feedback: </small>
                <div className=''>{orderDetails.feedback?.text}</div> 
                {orderDetails.feedback?.image !== '' && 
                  <Link to={orderDetails.feedback?.image}>
                    <Button type='button' className='d-block mx-auto my-2 my-md-4' size='sm'>
                      View Image
                    </Button>
                  </Link>
                }

              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail