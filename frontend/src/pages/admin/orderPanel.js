import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaEye } from 'react-icons/fa';
import { TbStatusChange } from "react-icons/tb";
import ModalWrapper from '../../component/modalWrapper';
import useOrder from '../../hooks/admin/useOrder';
import OrderDetail from '../../component/orderDetail';

const OrderPanel = () => {
    const { filteredList, modalData, modalToggle, searchText, filterDate, setFilterDate, setModalData, setModalToggle, setSearchText, handleOrderStatus, handleTableSorting } = useOrder();

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
                        <th className='cursor-pointer' onClick={() => handleTableSorting('buyerName')}>Buyer Name</th>
                        <th className='text-center cursor-pointer'  onClick={() => handleTableSorting('finalAmount')}>Order Value</th>
                        <th className='text-center'>Shipping Address</th>
                        <th className='text-center cursor-pointer'  onClick={() => handleTableSorting('status')}>Status</th>
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
                                        <Button variant="primary" onClick={() => handleModalForm('View Order Details', 'lg', order._id, 'View')}>
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
                                        <Button variant="warning" onClick={() =>  handleModalForm("Update Status", 'md', order._id, 'Status')}>
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
                    <OrderDetail id={modalData.orderID} />
                </ModalWrapper >
            : <></>}
        </>
    );
};

export default OrderPanel;
