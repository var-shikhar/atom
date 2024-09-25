import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaEye, FaSort } from 'react-icons/fa';
import { TbStatusChange } from "react-icons/tb";
import ModalWrapper from '../../component/modalWrapper';
import useOrder from '../../hooks/admin/useOrder';
import OrderDetail from '../../component/orderDetail';
import OrderStatus from '../../component/orderStatus';
import {useParams} from 'react-router-dom';

const CustomerOrderPanel = () => {
    const { id } = useParams();
    const { filteredList, modalData, modalToggle, searchText, filterDate, setFilterDate, setModalData, setModalToggle, setSearchText, handleTableSorting, handleConfirmation } = useOrder(id);

    function handleModalForm(title, size, id, mode) {
        setModalData({mode, orderID: id, size, title}); 
        setModalToggle(!modalToggle)
    }

    return (
        <>
            <div className='d-flex justify-content-between gap-2 align-items-center my-2 mt-md-4'>
                <h2 className='text-light'>Order Panel</h2>
            </div>
            <div className='my-2 my-md-4 d-flex gap-2 align-items-center justify-content-between'>
                <input type='text' name='searchUser' id='searchUser' placeholder='Search User by Name' className='form-control rounded-2' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <div className='d-flex gap-2'>
                    <input 
                        type='date' 
                        value={filterDate.stDate} 
                        onChange={(e) => setFilterDate(prev => ({ ...prev, stDate: e.target.value }))}
                        className='form-control'
                    />
                    <input 
                        type='date' 
                        value={filterDate.edDate} 
                        min={filterDate.stDate} 
                        onChange={(e) => setFilterDate(prev => ({ ...prev, edDate: e.target.value }))}    
                        className='form-control'
                    />
                </div>
            </div>
            <Table hover responsive>
            <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID & Date</th>
                        <th>Buyer Name</th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Order Value
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('finalAmount')} />
                            </div>
                        </th>
                        <th><div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>Shipping Address</div></th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Payment Mode
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('paymentMode')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Status
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('status')} />
                            </div>
                        </th>
                        <th className='text-center'>Interact</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList?.length > 0 ? filteredList.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div>
                                    <div>{order._id}</div>
                                    <small>{new Date(order.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true})}</small>
                                </div>
                            </td>
                            <td>{order.buyerName}</td>
                            <td className='text-center'>₹ {order.finalAmount}</td>
                            <td className='text-center'>
                                <div>{order.shippingAddress.city}</div>
                                <small>{order.shippingAddress.stateId?.name}</small>
                            </td>
                            <td className='text-center'>{order.paymentMode}</td>
                            <td className='text-center'>{order.status}</td>
                            <td>
                                <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="button-tooltip" {...props}>
                                                View Details
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="primary" onClick={() => handleModalForm('View Order Details', 'xl', order._id, 'View')}>
                                            <FaEye />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Update Status" {...props}>
                                                Update Status
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="warning" onClick={() =>  handleModalForm("Update Status", 'lg', order._id, 'Status')}>
                                            <TbStatusChange />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={7}>No Orders found</td></tr>}
                </tbody>
            </Table>
            {modalToggle ? 
                <ModalWrapper title={modalData.title} toggle={modalToggle} setToggle={setModalToggle} size={modalData.size}>
                    {modalData.mode === 'View' ? <OrderDetail id={modalData.orderID} /> : <OrderStatus orderID={modalData.orderID} handleConfirmation={handleConfirmation} />}
                </ModalWrapper >
            : <></>}
        </>
    );
};

export default CustomerOrderPanel;
