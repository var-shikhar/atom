import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const PaymentConfirmation = ({data}) => { 
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(true);
    return (
        <Modal show={showModal} onHide={() => setShowModal(!showModal)} backdrop={'static'} className='border text-light' size='md'> 
            <Modal.Body className='bg-success'>
                <div className='bg-inherit'>
                    <FaCheckCircle  className='bg-inherit' size={50}/>
                    <div className='bg-inherit'>
                        Dear <span className='fs-4 text-light bg-inherit'>{data.buyerName}</span>, <br />
                        We've Received your order (ID: {data.orderID}) of Amount (₹ {data.buyerName}/-)
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='bg-gray d-flex align-items-center justify-content-center py-2 bg-success'>
            <Button 
                variant="primary" 
                className='bg-light text-dark'
                onClick={() => {
                    setShowModal(!showModal)
                    navigate(`../product`)
                }}>Confirm
            </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default PaymentConfirmation;
