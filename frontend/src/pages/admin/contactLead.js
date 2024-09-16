import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ContactLeadStatusForm from '../../component/forms/admin/contactLeadStatus';
import ModalWrapper from '../../component/modalWrapper';
import useContactLead from '../../hooks/admin/useContactLead';

const ContactLeadPanel = () => {
    const { filterDate, filteredList, searchText, modalData, modalToggle, setModalData, setModalToggle, setFilterDate, setSearchText, handleContactLeadDeletion, handleTableSorting, handleConfirmation } = useContactLead()

    function handleModalForm(id) {
        setModalData({id: id}); 
        setModalToggle(!modalToggle)
    }

    return (
        <>
            <div className='d-flex justify-content-between gap-2 align-items-center my-2 mt-md-4'>
                <h2 className='text-light'>Contact Lead Panel</h2>
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
                        <th className='cursor-pointer' onClick={() => handleTableSorting('createdAt')}>Query Date</th>
                        <th className='cursor-pointer' onClick={() => handleTableSorting('userName')}>User Name</th>
                        <th className='cursor-pointer' onClick={() => handleTableSorting('email')}>User Email</th>
                        <th>User Phone</th>
                        <th>Message</th>
                        <th className='text-center cursor-pointer' onClick={() => handleTableSorting('status')}>Status</th>
                        <th className='text-center'>Interact</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList?.length > 0 ? filteredList.map((lead, index) => (
                        <tr key={lead._id}>
                            <td>{index + 1}</td>
                            <td>{new Date(lead.createdAt).toLocaleDateString('en-GB')}</td>
                            <td>{lead.userName}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>
                                <div>
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => <Tooltip id="Update Status" {...props}>{lead.message}</Tooltip>}
                                    >
                                        <div className='truncate-2-lines mh-auto'>{lead.message}</div>
                                    </OverlayTrigger>
                                </div>
                            </td>
                            <td className='text-center'>{lead.status}</td>
                            <td>
                                <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => <Tooltip id="Update Status" {...props}>Update Status</Tooltip>}
                                    >
                                        <Button onClick={() => handleModalForm(lead._id)}>
                                            <FaEdit />
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
                                        <Button variant="danger" type='button' onClick={() => handleContactLeadDeletion(lead._id)}>
                                            <FaTrashAlt />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={7}>No Contact Lead found</td></tr>}
                </tbody>
            </Table>
            {modalToggle ? 
                <ModalWrapper title={modalData.title} toggle={modalToggle} setToggle={setModalToggle} size={'sm'} >
                    <ContactLeadStatusForm id={modalData.id} handleConfirmation={handleConfirmation} />
                </ModalWrapper >
            : <></>}
        </>
    );
};

export default ContactLeadPanel;
