import React from 'react';
import { Button, Carousel } from 'react-bootstrap';
import { FaMinusCircle, FaPlusCircle, FaRegHeart, FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Feedback from '../../component/feedback';
import { useLoader } from '../../context/loaderContext';
import useProductDetail from '../../hooks/useProductDetail';

const ProductDetail = () => {
    const { setLoading } = useLoader()
    const { id } = useParams();
    const { userID, productDetail, variationList, selectedProduct, selectedOption, baseDetails, handleProductSelect, handleAddtoCart, handleWishListItems } = useProductDetail(id);

    if(id === ''){
        setLoading(true)
    }

    return (
        <section className='product-deatil-wrapper'>
            <div className='container'>
                <div className='row p-2 p-md-5'>
                    <div className='col-12 col-md-6'>
                        <Carousel fade className=''>
                            {selectedProduct !== null && userID && 
                                <div className='position-absolute end-0 me-3 bg-transparent z-2 cursor-pointer' onClick={() => handleWishListItems(selectedProduct.productID, baseDetails.isVariation, selectedProduct.variationID, false)}>
                                    {baseDetails.isWishListed ? <FaHeart color='red' className='bg-inherit' /> : <FaRegHeart color='pink' className='bg-inherit' />}
                                </div>
                            }
                            {baseDetails.userImages?.map((image, index) => 
                            <Carousel.Item key={index+1} className=''>
                                <img alt={`${productDetail?.name}s Image`} src={image} className='product-detail-image' />
                            </Carousel.Item>
                            )}
                        </Carousel>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className='product-detail-card'>
                            <div className='d-flex gap-2 align-items-center'>
                                <div className='product-category text-light'>{productDetail?.categoryId?.name}</div>
                                <a href='#reviews' className='bg-dark px-2 rounded text-decoration-none my-2 text-light'>View Reviews</a>
                            </div>
                            <div className='fs-2 fw-bold'>{productDetail?.name}</div>
                            {baseDetails.isVariation && <>
                                <div>Select {productDetail?.variationName}</div>
                                <select className='form-control' value={selectedOption} onChange={(e) => handleProductSelect(e.target.value)}>
                                    <option value={''} className='bg-light' disabled>Select ..</option>
                                    {variationList?.map((item, index) => <option className='bg-light' key={index} value={item.value} disabled={!item.isAvailable}>{String(item.value).toUpperCase()}</option>)}
                                </select>
                            </>}
                            {selectedProduct !== null && 
                                <>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <span className='text-decoration-line-through'>₹ {selectedProduct?.mrprice}/-</span>
                                        <span className='fs-5 fw-bold'>₹ {selectedProduct?.sellingPrice}/-</span>
                                    </div>
                                    {baseDetails.hasItem !== null ? (
                                        <div className='d-flex gap-2 align-items-center w-md-50'>
                                            <Button type='button' className='border-dark' size='md' onClick={() => handleAddtoCart(selectedProduct.productID, selectedProduct.variationID, baseDetails.isVariation, baseDetails.variType, 'Subtract', false)}>
                                                <FaMinusCircle color='white' />
                                            </Button>
                                            <div className='bg-light rounded px-2 fs-4 text-dark'>{baseDetails.hasItem?.productQuantity}</div>
                                            <Button type='button' className='border-dark' size='md' onClick={() => handleAddtoCart(selectedProduct.productID, selectedProduct.variationID, baseDetails.isVariation, baseDetails.variType, 'Add', false)}>
                                                <FaPlusCircle color='white' />
                                            </Button>
                                        </div>
                                    ) : selectedProduct.productStock > 0 ? (
                                        <Button type='button' className='product-btn w-50 ms-0' onClick={() => handleAddtoCart(selectedProduct.productID, selectedProduct.variationID, baseDetails.isVariation, baseDetails.variType, 'Add', false)}>
                                            Add to Cart
                                        </Button>
                                    ) : (
                                        <Button type='button' className='product-btn w-50 ms-0' disabled>
                                            Out of Stock
                                        </Button>
                                    )}
                                    <div>{selectedProduct?.productStock > 5 ? `${selectedProduct?.productStock - 2}+` : selectedProduct?.productStock } in Stock</div>
                                </>
                            }
                            <div className='my-2 my-md-4'>{productDetail?.description}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='row'>
                        {productDetail?.images?.map((image, index) => 
                            <div key={index + 1} className='col-12 col-md-4 mb-2'>
                                <img alt={`${productDetail?.name}s Image`} src={image} className='product-detail-image' />
                            </div>
                        )}
                    </div>
                </div>
                <div id='reviews' className='bg-inherit'>
                    <div className='fs-3 fw-bold border-bottom border-top my-2 my-md-4 bg-inherit'>Reviews</div>
                    <Feedback reviews={productDetail?.reviews} />
                </div>
            </div>

        </section>
    )
}

export default ProductDetail