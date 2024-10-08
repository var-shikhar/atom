import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaEdit, FaSort, FaTrashAlt, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import CouponForm from '../../component/forms/admin/coupon';
import ModalWrapper from '../../component/modalWrapper';
import useCoupon from '../../hooks/admin/useCoupon';

const CouponPanel = () => {
    const { filterDate, filteredList, modalData, modalToggle, searchText, handleConfirmation, handleCouponDeletion, handleCouponStatusUpdate, handleTableSorting, setFilterDate, setModalData, setModalToggle, setSearchText } = useCoupon();

    function handleModalForm(title, id) {
        setModalData({id, title}); 
        setModalToggle(!modalToggle)
    }

    return (
        <>
            <div className='d-flex justify-content-between gap-2 align-items-center my-2 mt-md-4'>
                <h2 className='text-light'>Coupon Panel</h2>
                <Button type='button' className='w-auto' onClick={() => handleModalForm('Add New Coupon', '')}>Add New Coupon</Button>
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
                        <th>
                            <div className='w-100 d-flex align-items-center gap-2 max-content bg-white'>
                                Coupon Code
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('code')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center gap-2 max-content bg-white'>
                                Start Date
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('startDate')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center gap-2 max-content bg-white'>
                                End Date
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('expirationDate')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Discount Type
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('discountType')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Discount Amount
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('discountValue')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Min Order Amount
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('minOrderAmount')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Max Discount
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('maxDiscount')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Usage Limit
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('usageLimit')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Used By
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('usedCount')} />
                            </div>
                        </th>
                        <th>
                            <div className='w-100 d-flex align-items-center justify-content-center gap-2 max-content bg-white'>
                                Status
                                <FaSort className='cursor-pointer bg-white' onClick={() => handleTableSorting('isActive')} />
                            </div>
                        </th>
                        <th>Interact</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList?.length > 0 ? filteredList.map((coupon, index) => (
                        <tr key={coupon._id}>
                            <td>{index + 1}</td>
                            <td>{coupon.code}</td>
                            <td>{new Date(coupon.startDate).toLocaleDateString('en-GB')}</td>
                            <td>{new Date(coupon.expirationDate).toLocaleDateString('en-GB')}</td>
                            <td className='text-center'>{coupon.discountType}</td>
                            <td className='text-center'>{coupon.discountType === 'Percentage' ? `${coupon.discountValue}%`  : `₹ ${coupon.discountValue}/-`}</td>
                            <td className='text-center'>₹ {coupon.minOrderAmount}/-</td>
                            <td className='text-center'>₹ {coupon.maxDiscount}/-</td>
                            <td className='text-center'>{coupon.usageLimit === 0 ? '-' : coupon.usageLimit}</td>
                            <td className='text-center'>{coupon.usedCount}</td>
                            <td className='text-center'>{coupon.isActive ? 'Active' : 'InActive'}</td>
                            <td>
                                <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Edit Coupon" {...props}>
                                                Edit Coupon
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="warning" onClick={() =>  handleModalForm("Edit Coupon's Details", coupon._id)}>
                                            <FaEdit />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Inactive-Coupon" {...props}>
                                                {coupon.isActive ? 'Inactivate Coupon' : 'Activate Coupon'}
                                            </Tooltip>
                                        )}
                                    >
                                        <Button onClick={() => handleCouponStatusUpdate(coupon._id, !coupon.isActive)}>
                                            {coupon.isActive ? <FaUserCheck /> : <FaUserSlash /> }
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Delete-Coupon" {...props}>
                                                Delete Coupon
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="danger" type='button' onClick={() => handleCouponDeletion(coupon._id)}>
                                            <FaTrashAlt />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={7}>No Coupon found</td></tr>}
                </tbody>
            </Table>
            {modalToggle ? 
                <ModalWrapper title={modalData.title} toggle={modalToggle} setToggle={setModalToggle} size={'lg'} >
                    <CouponForm id={modalData.id} handleConfirmation={handleConfirmation} />
                </ModalWrapper >
            : <></>}
        </>
    );
};

export default CouponPanel;
