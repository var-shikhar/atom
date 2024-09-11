import React, { useState, useEffect, startTransition } from 'react';
import ROUTES from '../util/routes';
import useAxioRequests from '../function/axioRequest';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const ProductModal = () => { 
    const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const { HandleGetRequest } = useAxioRequests();


  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('latestProductShowed');
    if (!hasSeenModal) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    loading && handleGetRequest(ROUTES.getLatestProduct)
  }, [loading])

  const handleClose = () => {
    sessionStorage.setItem('latestProductShowed', 'true');
    setShowModal(false);
  };

  async function handleGetRequest(route) {
    const response = await HandleGetRequest(route);
    if(response?.status === 200){
        startTransition(() => {
            setLoading(false)
            setProduct(response.data)
        })
    }
  }

  if (!showModal) {
    return null;
  }

  return (
    <Modal show={showModal} onHide={handleClose} backdrop={'static'} className='border rounded' size='md'> 
    <Modal.Header className='bg-gray'>
      <Modal.Title className='text-light fs-5'>Our Latest Collections</Modal.Title>
    </Modal.Header>
    <Modal.Body className=''>
        <div className='text-light'>
            <div className='fs-4'>{product.name}</div>
            <div className='w-100'>
                <img src={product.image} width={400} height={400} />
            </div>
            <small>{product.description}</small>
        </div>
    </Modal.Body>
    <Modal.Footer className='bg-gray d-flex align-items-center justify-content-center'>
      <Button variant="secondary" onClick={handleClose} size='sm'>
        Close
      </Button>
      <Button 
        variant="primary" 
        size='sm' 
        onClick={() => {
            handleClose()
            navigate(`../product/${product.id}`)
        }}>
        View Product
      </Button>
    </Modal.Footer>
  </Modal>
  );
};


{/* <div className="product-modal">
<div className="modal-content">
  <h2>{product.name}</h2>
  <img src={product.image} alt={product.name} />
  <p>{product.description}</p>
  <button onClick={handleClose}>Visit Product</button>
  <button onClick={handleClose}>Close</button>
</div>
</div> */}

export default ProductModal;
