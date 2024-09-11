import React from 'react'
import ContactForm from '../component/form/contact'

const Contact = () => {
  return (
    <section className='body-warpper contact-warpper'>
      <div className='overlay' />
      <div className='container w-75'>
        <div className='display-4 heading'>CONTACT US</div>
        <div className='para-1 text-center'>Have questions, or feedback, or need assistance? We're here to help! Reach out to us using the following contact information:</div>

        <div className='row bg-transparent'>
            <div className='col-12 col-md-7 bg-transparent'>
                <div className='heading-4'>Customer Support:</div>
                <div className='para-1'>For any inquiries regarding your order, product information, or general assistance, our dedicated customer support team is available to assist you. You can reach us via:</div>
                <div className='para-1'><b>Email:</b> <a href='mailto:admin@atomshop.in'>admin@atomshop.in</a></div>
                <div className='para-1'><b>Operating Hours:</b> Monday to Friday, 9:00 am to 5:00 pm (IST)</div>
                <div className='para-1'>We value your feedback and are committed to providing exceptional customer service. Whether you have a question, need assistance, or want to share your experience, we look forward to hearing from you. Our team will do our best to respond to your inquiries promptly.</div>
                <div className='para-1'>Please note that response times may vary depending on the volume of inquiries received, but we strive to provide timely and helpful responses to all customer interactions.</div>
                <div className='para-1'>Thank you for choosing our products. We appreciate your support and trust in our brand.</div>
            </div>
            <div className='col-12 col-md-5 bg-transparent'>
                <ContactForm />
            </div>
        </div>
      </div>
    </section>
  )
}

export default Contact