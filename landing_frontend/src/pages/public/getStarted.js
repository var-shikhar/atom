import React, { startTransition, useEffect, useState } from 'react';
import AUTH_FORMS from '../../component/login';
import useGetStarted from '../../hooks/useGetStarted';

const GetStarted = () => {
    const { modeType } = useGetStarted();
    const [activeMode, setActiveMode] = useState(modeType[0].slug)
    
    function handleModeChanges(slug){
        startTransition(() => {
            setActiveMode(slug)
        })
    }

    return (
       <section className='container'>
            <div className='row'>
                <div className='col-md-7 col-12'>
                    <div className='get-started-img-block'>
                        <img src={`${process.env.PUBLIC_URL}/get_started.svg`} alt='get started' className=''/>
                    </div>
                </div>
                <div className='col-md-5 col-12 d-flex align-items-center justify-content-center gap-2 flex-column'>
                    {activeMode === modeType[1].slug 
                        ? <AUTH_FORMS.RegisterComponent handleModeChanges={handleModeChanges}/> 
                        : activeMode === modeType[0].slug 
                        ? <AUTH_FORMS.LoginComponent handleModeChanges={handleModeChanges}/>
                        : <AUTH_FORMS.ForgotPasswordComponent handleModeChanges={handleModeChanges}/>
                    }
                </div>
            </div>
       </section>
    );
};


export default GetStarted