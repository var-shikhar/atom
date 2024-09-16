import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { IoIosCloseCircle } from "react-icons/io";

const ModalWrapper = ({ toggle, setToggle, title, children, size = 'lg' }) => {
    const handleClose = () => setToggle(false);

    return (
        <Modal 
            show={toggle} 
            onHide={handleClose} 
            size={size} 
            aria-labelledby="contained-modal-title-vcenter" 
            centered 
            backdrop="static"
            keyboard={false}>
            <Modal.Header className='py-2 border rounded'>
                <Modal.Title className='fs-5 fw-bold bg-inherit text-light'>{title}</Modal.Title>
                <div className='closeButton' onClick={handleClose}>
                    <IoIosCloseCircle className='bg-inherit' scale={2} />
                </div>
            </Modal.Header>
            <Modal.Body className='my-auto d-block position-relative border'>
                {children}
            </Modal.Body>
        </Modal>
    );
};

export default ModalWrapper;
