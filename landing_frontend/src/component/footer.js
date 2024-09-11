import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {

  return (
    <div className='footer-wrapper py-md-5'>
        <div className='text-light footer-containter my-md-4'>
            <div className='display-6'>EXPERIENCE THE BEST AUDIO</div>
            <div>
                <img src={`${process.env.PUBLIC_URL}/logo-1.png`} alt='Atom' />
            </div>
            <div className='d-flex gap-2'>
                <Link to="/privacy-policy" className="nav-link">PRIVACY POLICY</Link>   |
                <Link to="/shipping-policy" className="nav-link">SHIPPING POLICY</Link>   |
                <Link to="/terms-and-conditions" className="nav-link">TERMS & CONDITIONS</Link>  |
                <Link to="/refund-policy" className="nav-link">REFUND POLICY</Link>
            </div>
        </div>
    </div>
  )
}

export default Footer