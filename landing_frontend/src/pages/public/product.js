import React from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaMinusCircle, FaPlusCircle, FaRegHeart } from 'react-icons/fa';
import useOrder from '../../hooks/useOrder';
import useProduct from '../../hooks/useProduct';

const ProductPanel = () => {
    const { productList, userData, userID, handleProductNavigation } = useProduct();
    const { handleAddtoCart, handleWishListItems } = useOrder();
    return (
        <section className='product-wrapper'>
            <div className='container my-2 my-md-5'>
               <div className='row py-2 py-md-5'>
                    {productList?.map(product => {
                        // Find Cart Item
                        const cart = userID && userData?.cart ? userData.cart : JSON.parse(localStorage.getItem('localCart')) || [];
                        const hasItem = cart.find(item => item.productId === product.id);

                        // Find WishList Item
                        const wishList = userData?.wishList || [];
                        const hasWishListItem = wishList.find(item => item.productId === product.id);
                        return (
                            <div className='col-md-4 col-12 mb-2' key={product.id}>
                                <div className='product-card'>
                                    {product.hasVariation === false && userID && <div className='position-absolute end-0 me-3 bg-transparent z-2 cursor-pointer' onClick={() => handleWishListItems(product.id, false, '', false)}>
                                        {hasWishListItem ? <FaHeart color='red' className='bg-inherit' /> : <FaRegHeart color='pink' className='bg-inherit' />}
                                    </div>}
                                    <div className='d-flex flex-column gap-2' onClick={() => handleProductNavigation(product.id)}>
                                        <img className='product-image' src={product.coverImage} draggable="false" />
                                        <div className='text-light fw-bold fs-4 text-center'>{product.productName}</div>
                                        <div className='d-flex gap-2 justify-content-center fs-5'>
                                            <span className='text-decoration-line-through'>₹ {product.mrp}/-</span>
                                            <span className='text-light'>₹ {product.sellingPrice}/-</span>
                                        </div>
                                    </div>
                                    {product.hasVariation === false ? (
                                        <>
                                            {hasItem ? (
                                                <div className='d-flex gap-2 align-items-center justify-content-center border rounded p-2'>
                                                    <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(product.id, '', false, '', 'Subtract')}>
                                                        <FaMinusCircle />
                                                    </Button>
                                                    <div className='bg-light rounded px-2 fs-5 text-dark'>{hasItem.productQuantity}</div>
                                                    <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(product.id, '', false, '', 'Add')}>
                                                        <FaPlusCircle />
                                                    </Button>
                                                </div>
                                            ) : product.stock > 0 ? (
                                                <Button type='button' className='product-btn w-100' onClick={() => handleAddtoCart(product.id, '', '', false, 'Add')}>
                                                    Add to Cart
                                                </Button>
                                            ) : (
                                                <Button type='button' className='product-btn w-100' disabled>
                                                    Out of Stock
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Button type='button' className='product-btn w-100' onClick={() => handleProductNavigation(product.id)}>
                                            Add to Cart
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default ProductPanel