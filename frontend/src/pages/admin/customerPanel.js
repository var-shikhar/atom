import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { CiViewList } from 'react-icons/ci';
import useCustomer from '../../hooks/admin/useCustomer';

const CustomerPanel = () => {
    const { filteredList, searchText, setSearchText, handleCustomerDetail, handleTableSorting } = useCustomer();
    
    return (
        <>
            <div className='d-flex justify-content-between gap-2 align-items-center my-2 mt-md-4'>
                <h2 className='text-light'>Customer Panel</h2>
            </div>
            <div className='my-2 my-md-4 d-flex gap-2 align-items-center justify-content-between'>
                <input type='text' name='searchUser' id='searchUser' placeholder='Search User by Name' className='form-control rounded-2' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th className='text-center cursor-pointer' onClick={() => handleTableSorting('userName')}>Customer Name</th>
                        <th className='text-center cursor-pointer' onClick={() => handleTableSorting('email')}>Customer Email</th>
                        <th className='text-center cursor-pointer' onClick={() => handleTableSorting('email')}>Customer Phone</th>
                        <th className='text-center cursor-pointer' onClick={() => handleTableSorting('phone')}>Total Order Amount</th>
                        <th className='text-center cursor-pointer' onClick={() => handleTableSorting('totalOrderAmount')}>Interact</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList?.length > 0 ? filteredList.map((customer, index) => (
                        <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td>{customer.userName}</td>
                            <td className='text-center'>{customer.userEmail}</td>
                            <td className='text-center'>{customer.userPhone}</td>
                            <td className='text-center'>₹ {customer.totalAmount}/-</td>
                            <td>
                                <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="View Orders" {...props}>
                                                View Orders
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="primary" onClick={() => handleCustomerDetail(customer.userID)}>
                                            <CiViewList />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={6}>No Customers found</td></tr>}
                </tbody>
            </Table>
        </>
    );
};

export default CustomerPanel;
