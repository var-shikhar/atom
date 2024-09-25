import { startTransition, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { useAuthContext } from '../context/authContext';
import { useCart } from '../context/cartContext';
import useOrder from '../hooks/useOrder';

const CartList = () => {
  const { isOpen, setISOpen } = useCart();
  const { userID, userData } = useAuthContext()
  const { handleAddtoCart, handleGoToCheckout } = useOrder();

  const [localCart, setLocalCart] = useState(JSON.parse(localStorage.getItem('localCart')) || []);
  const [productList, setProductList] = useState([])

  // Trigger Cart Update
  useEffect(() => {
    const handleStorageChange = () => {
        const updatedCart = JSON.parse(localStorage.getItem('localCart')) || [];
        setLocalCart(updatedCart);
    };

    // Listen for the custom event
    window.addEventListener('localCartUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('localCartUpdated', handleStorageChange);
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update Product Cart
  useEffect(() => {
    const updatedCart = userID && userData?.cart ? userData.cart : localCart;
    startTransition(() => {
      setProductList(updatedCart)
    })      
  }, [userID, userData, localCart])

  if(isOpen === undefined){
    return 
  }


  return (
    <>
      <Offcanvas show={isOpen} onHide={() => setISOpen(!isOpen)} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-light'>Cart Items</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='position-relative'>
          <div className='h-100 w-100 overflow-y-scroll'>
            {productList?.length > 0 ? 
              <div className='d-flex gap-3 flex-column text-light'>
                {productList?.map((item) => (
                  <div key={item.id} className='row'>
                    <div className='col-3'>
                      <img src={item.coverImage} className='w-100 rounded h-auto object-fit-cover' />
                    </div>
                    <div className='col-9 d-flex flex-column gap-2'>
                      <div className='fs-5'>{item.productName}</div>
                      <div className='d-flex gap-2 align-items-center'>
                        <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(item.productId, item.variationID, item.isVariation, item.variationType, 'Subtract', false)}>
                          <FaMinusCircle/>
                        </Button>
                        <div className='bg-light rounded px-2 fs-5 text-dark'>{item.productQuantity}</div>
                        <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(item.productId, item.variationID, item.isVariation, item.variationType, 'Add', false)}>
                          <FaPlusCircle />
                        </Button>
                        <small className='bg-light rounded px-2 text-dark max-content'>{item.variationType}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div> 
              : <div className='text-light text-center my-2 my-md-4'>No items in cart!</div>
            }
          </div>
          <Button type='button' className='w-100 mt-auto position-absolute bottom-0' onClick={handleGoToCheckout}>Go to Checkout</Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CartList;