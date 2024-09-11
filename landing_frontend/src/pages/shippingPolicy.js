import React from 'react'

const ShippingPolicy = () => {
  return (
    <section className='body-warpper shipping-warpper'>
      <div className='overlay' />
      <div className='container'>
        <div className='display-4 heading'>SHIPPING POLICY</div>
        <div className='heading-4 mt-md-4'>Order Processing:</div>
        <div className='para-1'>
          Orders are typically processed within 1-2 business days upon confirmation of payment.
          <br />
          Orders placed on weekends or holidays will be processed on the next business day.
          <br />
          Customers will receive a confirmation email with the order details once the order has been processed.
        </div>

        <div className='heading-4'>Shipping Methods:</div>
        <div className='para-1'>
          We offer several shipping options based on your location and preference.
          <br />
          <b>Standard Shipping:</b> Estimated delivery within 3-7 business days.
          <br />
          <b>Express shipping:</b> Faster delivery options are available for an additional fee.
          <br />
          Shipping costs and delivery estimates are provided during the checkout process.
        </div>

        <div className='heading-4'>Shipping Restrictions:</div>
        <div className='para-1'>We currently only ship within India.</div>

        <div className='heading-4'>Order Tracking:</div>
        <div className='para-1'>Once your order has been shipped, a tracking number and a link to track your package will be provided via email.</div>
        <div className='para-1'>Customers can track the status of their order through our website or the designated shipping carrier's website.</div>

        <div className='heading-4'>Shipping Charges:</div>
        <div className='para-1'>Shipping charges are calculated based on the weight of the package and the destination.</div>
        <div className='para-1'>Free shipping may be offered for orders exceeding a specified amount (if applicable).</div>

        <div className='heading-4'>Returns Due to Non-Delivery:</div>
        <div className='para-1'>If a package is returned to us due to an incorrect or incomplete address provided by the customer, the customer is responsible for additional shipping charges to resend the package.</div>

        <div className='heading-4'>Please Note:</div>
        <div className='para-1'>Shipping policies and delivery times may be subject to change during peak seasons or unforeseen circumstances.</div>
        <div className='para-1'>We strive to provide accurate delivery estimates, but actual delivery times may vary based on factors beyond our control.</div>
      </div>
    </section>
  )
}

export default ShippingPolicy