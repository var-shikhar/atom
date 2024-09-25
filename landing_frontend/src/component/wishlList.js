import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { MdDelete } from "react-icons/md";
import { useWishList } from '../context/wishlistContext';
import useOrder from '../hooks/useOrder';

const WishList = () => {
  const { wISOpen, setWISOpen } = useWishList();
  const { userData, handleMoveItemsToCart, handleWishListItems } = useOrder();

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
            {userData?.wishList?.length > 0 ? 
              <div className='d-flex gap-3 flex-column text-light'>
                {userData.wishList.map((item) => (
                  <div key={item.id} className='row'>
                    <div className='col-2'>
                      <img src={item.coverImage} className='rounded object-fit-cover' height={50} width={50} />
                    </div>
                    <div className='col-10 d-flex justify-content-between'>
                      <div className=''>
                        <div className='fs-5 cursor-pointer mb-1' onClick={() => window.location.href = `../product/${item.productId}`}>{item.productName}</div>
                        <small className='bg-light px-2 rounded text-dark me-2 cursor-pointer' onClick={() => handleMoveItemsToCart(item.productId, item.variationID, item.isVariation)}>Move to Cart</small>
                        {item.variationType !== '' && <small className='bg-white px-2 rounded text-dark'>{item.variationType}</small>}
                      </div>
                      <div>
                        <Button type='button' className='max-content' size='sm' onClick={() => handleWishListItems(item.productId, item.isVariation, item.variationID, false)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div> 
              : <div className='text-light text-center my-2 my-md-4'>No items in your wishlist!</div>
            }
          </div>
          {/* <Button type='button' className='w-100 mt-auto position-absolute bottom-0' onClick={handleMoveItemsToCart}>Move All Items to Cart</Button> */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default WishList;