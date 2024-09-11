import React, { useEffect } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useLoader } from '../context/loaderContext';
import useOrder from '../hooks/useOrder';
import useProductDetail from '../hooks/useProductDetail';

const ProductDetail = () => {
    const { setLoading } = useLoader()
    const { id } = useParams();
    const { productDetail, variationList } = useProductDetail(id);
    const { userData, handleAddtoCart } = useOrder()

    if(id === ''){
        setLoading(true)
    }

    return (
        <section className='product-deatil-wrapper'>
            <div className='container'>
                <div className='row p-2 p-md-5'>
                    <div className='col-12 col-md-6'>
                        <Carousel fade className=''>
                            {productDetail?.images?.map((image, index) => 
                            <Carousel.Item key={index+1} className=''>
                                <img alt={`${productDetail?.name}s Image`} src={image} className='product-detail-image' />
                            </Carousel.Item>
                            )}
                        </Carousel>
                    </div>
                    <div className='col-12 col-md-6'>
                        <div className='product-detail-card'>
                            <div className='d-flex gap-2 align-items-center'>
                                <div className='product-category'>{productDetail?.categoryId?.name}</div>
                                <a href='#reviews' className='bg-dark px-2 text-light rounded text-decoration-none my-2'>View Reviews</a>
                            </div>

                            <div className='fs-2 fw-bold'>{productDetail?.name}</div>
                            <div className='d-flex gap-2 align-items-center'>
                                <span className='text-decoration-line-through'>₹ {productDetail?.baseMRPPrice}/-</span>
                                <span className='fs-5 fw-bold'>₹ {productDetail?.baseSellingPrice}/-</span>
                            </div>
                            {productDetail?.isVariationProduct ? <>
                                <div>Select {productDetail?.variationName}</div>
                                <select className='form-control' defaultValue={''}>
                                    <option value={''} className='bg-light'>Select ..</option>
                                    {variationList?.map((item, index) => <option className='bg-light' key={index} value={item}>{String(item).toUpperCase()}</option>)}
                                </select>
                                <div className='d-flex gap-2 align-items-center'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        {/* <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(productDetail._id, '', false, 'Subtract', false)}>
                                            <FaMinusCircle/>
                                        </Button>
                                        <div className='bg-light rounded px-2 fs-5 text-dark'>{productDetail?.stock}</div>
                                        <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(productDetail._id, '', false, 'Add', false)}>
                                            <FaPlusCircle />
                                        </Button> */}
                                        <Button type='button' className='product-btn w-100' onClick={() => handleAddtoCart(productDetail?._id, '', false, 'Add')}>Add to Cart</Button>
                                    </div>
                                </div>
                                <div>{productDetail?.baseStock > 5 ? `${productDetail?.baseStock - 2}+` : productDetail?.baseStock } in Stock</div>

                            </> :<>
                                <div className='d-flex gap-2 align-items-center'>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <Button type='button' className='product-btn w-100' onClick={() => handleAddtoCart(productDetail?._id, '', false, 'Add')}>Add to Cart</Button>
                                        {/*<Button type='button' className='product-btn w-100' disabled>Out of Stock</Button> */}
                                        {/* <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(productDetail._id, '', false, 'Subtract', false)}>
                                            <FaMinusCircle/>
                                        </Button>
                                        <div className='bg-light rounded px-2 fs-5 text-dark'>{productDetail?.stock}</div>
                                        <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(productDetail._id, '', false, 'Add', false)}>
                                            <FaPlusCircle />
                                        </Button> */}
                                    </div>
                                </div>
                                <div>{productDetail?.baseStock > 5 ? `${productDetail?.baseStock - 2}+` : productDetail?.baseStock } in Stock</div>
                            </>}
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
                <div id='reviews'>

                </div>
            </div>

        </section>
    )
}

export default ProductDetail