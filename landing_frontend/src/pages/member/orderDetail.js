import React from "react";
import { Button } from "react-bootstrap";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ReviewForm from "../../component/form/reviewForm";
import ModalWrapper from "../../component/modalWrapper";
import ViewReview from "../../component/viewReview";
import useOrderDetail from "../../hooks/useOrderDetail";

const OrderDetails = () => {
    const { id } = useParams();
    const { orderDetail, modalData, modalToggle, setModalData, setModalToggle, handleNavigation, handleConfirmation } = useOrderDetail(id);
    
    function handleReviewModal(id, productID, title, size, mode, text, imageURL){
        setModalData({mode: mode, orderID: id, productID: productID, size: size, title: title, imageURL: imageURL, text: text});
        setModalToggle(!modalToggle)
    }
    return (
        <section className='body-warpper checkout-warpper'>
            <div className='container text-light'>
                <div className='display-6 heading'>Order Detail</div>
                <hr />
                <small className="cursor-pointer my-2 d-flex align-items-center gap-2" onClick={handleNavigation}>
                    <FaLongArrowAltLeft />
                    Back to Orders
                </small>
                <div className='text-light overflow-y-scroll hidden-scrollbar'>
                    <div className='border p-2 rounded shadow row g-0 mb-2'>
                        <div className='col-md-4 col-12 h-auto px-2'>
                            <div className='fw-bold my-2 ps-md-2'>Shipping Address</div>
                            <div className="ps-md-2">
                                {orderDetail.buyerName} <br />
                                {orderDetail.shippingAddress?.shippingAddress}, <br /> 
                                {orderDetail.shippingAddress?.city}, {orderDetail.shippingAddress?.stateId?.name}, <br /> 
                                {orderDetail.shippingAddress?.zipCode}, {orderDetail.shippingAddress?.countryId?.name}
                            </div>
                        </div>
                        <div className='col-md-4 col-12 h-auto px-2'>
                            <div className='fw-bold my-2 ps-md-2'>Payment Method</div>
                            <div className="ps-md-2">
                                {orderDetail.paymentMode}
                            </div>
                        </div>
                        <div className='col-md-4 col-12 h-auto px-2'>
                            <div className='fw-bold my-2 ps-md-2'>Order Summary</div>
                            <div className="ps-md-2">
                                <div className='d-flex align-items-center'>
                                    <small className='w-50'>Order Total </small>
                                    <div className='w-50 d-flex justify-content-between align-items-center'>: 
                                        <span>₹ {orderDetail.totalAmount} /-</span>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <small className='w-50'>Taxes </small>
                                    <div  className='w-50 d-flex justify-content-between align-items-center'>: 
                                        <span>+ ₹ {orderDetail.totalTax} /-</span>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <small className='w-50'>SubTotal </small>
                                    <div  className='w-50 d-flex justify-content-between align-items-center'>: 
                                        <span>₹ {orderDetail.totalAmount + orderDetail.totalTax} /-</span>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <small className='w-50'>Discount </small>
                                    <div  className='w-50 text-danger d-flex justify-content-between align-items-center'>: 
                                        <span>- ₹ {orderDetail.discount} /-</span>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center fs-5 my-2 fw-bold border-top border-bottom'>
                                    <small className='w-50'>Final Amount </small>
                                    <div className='w-50 text-success d-flex justify-content-between align-items-center'>:
                                        <span>- ₹ {(orderDetail.totalAmount + orderDetail.totalTax) - orderDetail.discount} /-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border p-2 rounded shadow g-0'>
                        <div className='fw-bold my-2 ps-md-2'>Product List</div>
                        <div className="ps-md-2">
                            {orderDetail?.products?.length > 0 ? 
                                <div className='p-2 shadow w-100'>
                                    {orderDetail.products.map((item, index) => 
                                        <React.Fragment key={item._id}>
                                            <div className='d-flex align-items-center justify-content-between w-100'>
                                                <div className='d-flex w-75 align-items-center justify-content-between'>
                                                    <div className="d-flex">
                                                        <img src={item.productImage} width={50} height={50} className='rounded'/>
                                                        <div className="d-flex flex-column ps-2">
                                                            <div className='text-truncate'>{item.productName}</div>
                                                            <div>
                                                                <span>{item.productSKU}</span> 
                                                                {item.variationType !== '' && <small className='bg-light px-2 ms-2 rounded text-dark'>{item.variationType}</small>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="me-2">
                                                        {(orderDetail.status === 'Delivered' || orderDetail.status === 'Returned') && <>
                                                            {!item.hasFeedback  
                                                                ? <Button type='button' className="py-0" size='sm' onClick={() => handleReviewModal(orderDetail._id, item._id, 'Write a reivew', 'md', 'Form', '', '')}>Write a Review</Button> 
                                                                : <Button type='button' className="py-0" size='sm'  onClick={() => handleReviewModal(orderDetail._id, item._id, 'View your reivew', 'md', 'View', item?.feedback?.text, item?.feedback?.image)}>View Review</Button>
                                                            }
                                                        </>}
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-column me-md-2 w-25'>
                                                    <div>{item.productQuantity} {item.productQuantity > 1 ? 'PCs' : 'PC'}</div>
                                                    <div>₹ {item.productPrice}/-</div>
                                                </div>
                                            </div>
                                            {index < orderDetail?.products.length - 1 && <hr /> }
                                        </React.Fragment>
                                    )}
                                </div> 
                                : <div> No Product Found!</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ModalWrapper toggle={modalToggle} setToggle={setModalToggle} title={modalData.title} size={modalData.size}>
                {modalData.mode === 'Form' 
                    ? <ReviewForm id={modalData.orderID} productID={modalData.productID} handleConfirmation={handleConfirmation} />
                    : <ViewReview imageURL={modalData.imageURL} text={modalData.text} />
                }
            </ModalWrapper>
        </section>
    )
}

export default OrderDetails;
