import React, {useState, useEffect, startTransition} from 'react'
import OrderStatusForm from './forms/admin/orderStatus'
import useAxioRequests from '../function/axioRequest'
import ROUTES from '../util/routes'

const OrderStatus = ({orderID = '', handleConfirmation}) => {
    const { HandleGetRequest } = useAxioRequests()
    const [loading, setLoading] = useState(true);
    const [statusLog, setStatusLog] = useState({})

    useEffect(() => {
        if(loading && orderID !== '') handleGetData(`${ROUTES.commonOrderStatusRoute}/${orderID}`)
    }, [loading, orderID])

    async function handleGetData(route) {
        const response = await HandleGetRequest(route);
        if(response?.status === 200){
            startTransition(() => {
                setStatusLog(response.data)
                setLoading(false)
            })
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-6 h-auto text-light'>
                    {statusLog.statusList?.length > 0 ?
                        <div className='d-flex flex-column gap-2 rounded border p-2 h-100 overflow-y-scroll hidden-scrollbar' style={{maxHeight: '75vh'}}>
                            {statusLog.statusList?.map(item => 
                                <React.Fragment key={item._id}>
                                    <div>
                                        <div className='fs-5'>{item.status}</div>
                                        <div>{item.note}</div>
                                        <small>{new Date(item.updateDate).toLocaleDateString('en-GB')}</small>
                                    </div>
                                    <hr className='my-0' />
                                </React.Fragment>
                            )}
                        </div> 
                    : <div>No Status Log</div>}
                </div>
                <div className='col-md-6'>
                    <OrderStatusForm id={orderID} handleConfirmation={handleConfirmation} />
                </div>
            </div>
        </div>
    )
}

export default OrderStatus