import React from 'react'
import { Button } from 'react-bootstrap';
import useMyOrder from '../../hooks/useMyOrder';

const MyOrder = () => {
    const {filterDate, filteredList, searchText, ORDER_STATUS, filterStatus, setFilterDate, setSearchText, setFilterStatus, handleOrderDetails} = useMyOrder()
    //     feedback: { text: '', image: '' },

    return (
        <section className='body-warpper checkout-warpper'>
            <div className='container text-light'>
            <div className='display-6 heading'>Your Orders</div>
            <div className='my-2 my-md-4 d-flex gap-2 align-items-center justify-content-between'>
                <input type='text' name='searchUser' id='searchUser' placeholder='Search Order by ID' className='form-control rounded-2' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <div className='d-flex gap-2'>
                    <input 
                        type='date' 
                        value={filterDate.stDate} 
                        onChange={(e) => setFilterDate(prev => ({ ...prev, stDate: e.target.value }))}
                        className='form-control'
                    />
                    <input 
                        type='date' 
                        value={filterDate.edDate} 
                        min={filterDate.stDate} 
                        onChange={(e) => setFilterDate(prev => ({ ...prev, edDate: e.target.value }))}    
                        className='form-control'
                    />
                    <select name='statusFilter' id="statusFilter" className='form-control max-content' value={filterStatus} defaultValue={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option className='bg-light' value={''} aria-readonly readonly>Select Status</option>
                        {ORDER_STATUS?.map(item => <option className='bg-light' key={item.id} value={item.slug}>{item.status}</option>)}
                    </select>
                </div>
            </div>
                <div className='row border shadow-lg p-2 py-md-4 rounded my-2 my-md-4'>
                    {filteredList?.length > 0 ? 
                        <div className='d-flex flex-column gap-2'>
                            {filteredList.map(item => 
                                <React.Fragment key={item.orderID}>
                                    <div className='mb-2'>
                                        <div className='bg-gray rounded p-2 d-flex gap-2 justify-content-between'>
                                            <div className='bg-inherit d-flex gap-4 justify-content-between'>
                                                <div className='bg-inherit'> 
                                                    <small className='bg-inherit '>Order Placed At</small>
                                                    <div className='bg-inherit'>{new Date(item.orderDate).toLocaleDateString('en-GB')}</div>
                                                </div>
                                                <div className='bg-inherit'> 
                                                    <small className='bg-inherit'>Total</small>
                                                    <div className='bg-inherit'>₹ {item.orderTotal}</div>
                                                </div>
                                                <div className='bg-inherit'> 
                                                    <small className='bg-inherit'>Ship to</small>
                                                    <div className='bg-inherit'>{item.buyerName}</div>
                                                </div>
                                            </div>
                                            <div className='bg-inherit d-flex flex-column gap-2 me-md-3'>
                                                <div className='bg-inherit'> 
                                                    <small className='bg-inherit '>Order ID</small>
                                                    <span className='bg-inherit'>  #{item.orderID}</span>
                                                </div>
                                            <small className='cursor-pointer text-primary my-0 ms-auto' onClick={() => handleOrderDetails(item.orderID)}>View Order Detail</small>
                                            </div>
                                        </div>
                                        <div className='p-2 pt-md-3 rounded shadow row'>
                                            <div className='col-12 col-md-8'>
                                                {item.productList?.length > 0 ? 
                                                    <div className='d-flex gap-2 flex-column'>
                                                        {item.productList?.map(product => 
                                                            <div key={product.productID} className='d-flex gap-2 align-items-center'>
                                                                <img src={product.productImage} width={40} height={40} className='object-fit-cover rounded' />
                                                                <div>
                                                                    <div>{product.productName}</div>
                                                                    <div>{product.productQty} {product.productQty > 1 ? 'PCs' : 'PC'}</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                :<div>No product found!</div>}
                                            </div>
                                            <div className='col-12 col-md-4'>
                                               <div className='d-flex gap-4 justify-content-start'>
                                                    <div className=''> 
                                                        <small className=''>Status</small>
                                                        <div className=''>{item.status}</div>
                                                    </div>
                                                    <div className=''> 
                                                        <small className=' '>Payment Mode</small>
                                                        <div className=''>{item.paymentMode}</div>
                                                    </div>
                                               </div>
                                                {!item.hasFeedback  ? <Button type='button' className='d-block me-auto mt-2'>Write a Review</Button> : <Button type='button'  className='d-block me-auto mt-2'>View Review</Button>}
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='my-0' />
                                </React.Fragment>
                            )}
                        </div>
                    : <div>No orders found!</div>
                    }
                </div>
            </div>
        </section>
    )
}


export default MyOrder