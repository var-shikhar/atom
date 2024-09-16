import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuthContext } from '../context/authContext';
import { useWishList } from '../context/wishlistContext';
import useOrder from '../hooks/useOrder';

const WishList = () => {
  const { wISOpen, setWISOpen } = useWishList();
  const { userData } = useAuthContext()
  const { handleMoveItemsToCart } = useOrder();


  if(wISOpen === undefined){
    return 
  }

  return (
    <>
      <Offcanvas show={wISOpen} onHide={() => setWISOpen(!wISOpen)} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-light'>WishList Items</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='position-relative'>
          <div className='h-100 w-100 overflow-y-scroll'>
            {userData?.wishlist?.length > 0 ? 
              <div className='d-flex gap-3 flex-column text-light'>
                {userData?.wishlist.map((item) => (
                  <div key={item.id} className='row'>
                    <div className='col-3'>
                      <img src={item.coverImage} className='w-100 rounded h-auto object-fit-cover' />
                    </div>
                    <div className='col-9 d-flex flex-column gap-2'>
                      <div className='fs-5'>{item.productName}</div>
                      <small>₹ {item.productPrice}/-</small>
                    </div>
                  </div>
                ))}
              </div> 
              : <div className='text-light text-center my-2 my-md-4'>No items in your wishlist!</div>
            }
          </div>
          <Button type='button' className='w-100 mt-auto position-absolute bottom-0' onClick={handleMoveItemsToCart}>Add Items to Cart</Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default WishList;