import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AUTH_FORMS from '../../component/login';
import { useAuthContext } from '../../context/authContext';

const ResetPassword = () => {
    const {userID} = useAuthContext();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if(userID !== '' && userID !== undefined && userID !== null){
            navigate('../get-started')
        }
    })
    return (
       <section className='container'>
            <div className='row'>
                <div className='col-md-7 col-12'>
                    <div className='get-started-img-block'>
                        <img src={`${process.env.PUBLIC_URL}/get_started.svg`} alt='get started' className=''/>
                    </div>
                </div>
                <div className='col-md-5 col-12 d-flex align-items-center justify-content-center gap-2 flex-column'>
                    <AUTH_FORMS.UpdatePasswordComponent />
                </div>
            </div>
       </section>
    );
};


export default ResetPassword