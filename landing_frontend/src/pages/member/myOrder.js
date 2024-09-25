import React from 'react';
import { Button } from 'react-bootstrap';
import ReviewForm from '../../component/form/reviewForm';
import ModalWrapper from '../../component/modalWrapper';
import ViewReview from '../../component/viewReview';
import useMyOrder from '../../hooks/useMyOrder';

const MyOrder = () => {
    const {filterDate, filteredList, searchText, ORDER_STATUS, filterStatus, modalToggle, modalData, setModalData, setModalToggle, setFilterDate, setSearchText, setFilterStatus, handleOrderDetails, handleConfirmation} = useMyOrder();
    
    function handleReviewModal(id, productID, title, size, mode, text, imageURL, rating){
        setModalData({mode: mode, orderID: id, productID: productID, size: size, title: title, review : {imageURL: imageURL, text: text, rating: rating}});
        setModalToggle(!modalToggle)
    }
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
                        <option className='bg-light' value={''} aria-readonly={true} readOnly>Select Status</option>
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
                                                    <div className='d-flex gap-2 flex-column w-100'>
                                                        {item.productList?.map(product => 
                                                            <div key={product.productID} className='d-flex gap-2 align-items-center justify-content-between w-100'>
                                                                <div className='d-flex gap-2 align-items-center'>
                                                                    <img src={product.productImage} width={40} height={40} className='object-fit-cover rounded' />
                                                                    <div>
                                                                        <div>{product.productName}</div>
                                                                        <div>
                                                                            {product.productQty} {product.productQty > 1 ? 'PCs' : 'PC'}
                                                                            {product.variationType !== '' && <small className='bg-light px-2 ms-2 rounded text-dark'>{product.variationType}</small>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {(item.status === 'Delivered' || item.status === 'Returned') && <>
                                                                    {!product.hasFeedback  
                                                                        ? <Button type='button' size='sm' onClick={() => handleReviewModal(item.orderID, product.productID, 'Write a reivew', 'md', 'Form', '', '')}>Write a Review</Button> 
                                                                        : <Button type='button' size='sm'  onClick={() => handleReviewModal(item.orderID, product.productID, 'View your reivew', 'md', 'View', product?.feedback?.text, product?.feedback?.image, product?.feedback?.rating)}>View Review</Button>
                                                                    }
                                                                </>}
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
            <ModalWrapper toggle={modalToggle} setToggle={setModalToggle} title={modalData.title} size={modalData.size}>
                {modalData.mode === 'Form' 
                    ? <ReviewForm id={modalData.orderID} productID={modalData.productID} handleConfirmation={handleConfirmation} />
                    : <ViewReview imageURL={modalData.review.imageURL} text={modalData.review.text} rating={modalData.review.rating} />
                }
            </ModalWrapper>
        </section>
    )
}

export default MyOrder