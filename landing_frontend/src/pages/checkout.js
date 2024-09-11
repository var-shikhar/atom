import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import { Button, FormCheck, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import NavSteps from '../component/navStep'
import PaymentConfirmation from '../component/paymentConfirmation'
import { FireToast } from '../context/toastContext'
import useCheckout from '../hooks/useCheckout'
import VALIDATION from '../util/validation'

const Checkout = () => {
    const { countryList, stateList, couponCode, submissionData,  activeStep, checkoutSteps, defaultValues, userData, loading, orderDetails, setCouponCode, setOrderDetails, setActiveStep, handleCheckout, handlePaymentConfirmation, handleCouponValidation, handleReEditCoupon } = useCheckout()
    return (
        <section className='body-warpper checkout-warpper'>
            <div className='container text-light'>
                <div className='display-4 heading'>Checkout</div>
                <NavSteps list={checkoutSteps} activeNav={activeStep} />
                <Formik
                    initialValues={defaultValues}
                    enableReinitialize
                    validationSchema={VALIDATION.checkoutFormValidation}
                    onSubmit={async(values, {setSubmitting}) => {
                        try{
                            await handleCheckout(values)
                        } catch(err){
                            console.error(err);
                            FireToast({title: 'Error', subTitle: 'Something went wrong, Try later!'})
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ errors, touched, dirty, isValid, values, setFieldValue }) => {  
                        return(
                            <Form className=''>
                                {activeStep === checkoutSteps[0].slug ? 
                                    <div className='row border shadow-lg p-2 rounded w-md-75 mx-auto my-2 my-md-4'>
                                        <div className='text-center text-light fs-4 border-bottom'>Buyer Details</div>
                                        <FormGroup className='col-12 my-2'>
                                            <FormLabel htmlFor="buyerName">Buyer Name</FormLabel>
                                            <Field
                                                name="buyerName"
                                                type="text"
                                                placeholder='John'
                                                as={FormControl}
                                                isInvalid={!!(errors.buyerName && touched.buyerName)}
                                            />
                                            <ErrorMessage name="buyerName" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6 my-2'>
                                            <FormLabel htmlFor="buyerPhone">Buyer Phone</FormLabel>
                                            <Field
                                                name="buyerPhone"
                                                type="number"
                                                min={6666666666}
                                                max={9999999999}
                                                placeholder='9898-XXXXXX'
                                                as={FormControl}
                                                isInvalid={!!(errors.buyerPhone && touched.buyerPhone)}
                                            />
                                            <ErrorMessage name="buyerPhone" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6 my-2'>
                                            <FormLabel htmlFor="buyerEmail">Buyer Email</FormLabel>
                                            <Field
                                                name="buyerEmail"
                                                type="email"
                                                placeholder='user@example.com'
                                                as={FormControl}
                                                isInvalid={!!(errors.buyerEmail && touched.buyerEmail)}
                                            />
                                            <ErrorMessage name="buyerEmail" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 mb-2'>
                                            <FormLabel htmlFor="bilingAddress">Billing Address</FormLabel>
                                            <Field
                                                name="bilingAddress"
                                                as="textarea"
                                                placeholder="bilingAddress.."
                                                rows={4}
                                                className={`form-control ${errors.bilingAddress && touched.bilingAddress ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage name="bilingAddress" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6'>
                                            <FormCheck 
                                                type="checkbox"
                                                name="isSimilar"
                                                label="Is Similar to Billing Address"
                                                className='text-light my-auto d-block'
                                                checked={values.isSimilar}
                                                onChange={e => {
                                                    const value = e.target.checked ? values.bilingAddress : '';
                                                    setFieldValue("shippingAddress", value); 
                                                    setFieldValue("isSimilar", e.target.checked); 
                                                }}
                                                isInvalid={!!(errors.isSimilar && touched.isSimilar)}
                                            />
                                            <ErrorMessage name="isSimilar" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 mb-2'>
                                            <FormLabel htmlFor="shippingAddress">Shipping Address</FormLabel>
                                            <Field
                                                name="shippingAddress"
                                                as="textarea"
                                                placeholder="shippingAddress.."
                                                rows={4}
                                                disabled={values.isSimilar}
                                                className={`form-control ${errors.shippingAddress && touched.shippingAddress ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage name="shippingAddress" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6 mb-2'>
                                            <FormLabel htmlFor="city">City</FormLabel>
                                            <Field
                                                name="city"
                                                type="text"
                                                placeholder='-'
                                                as={FormControl}
                                                isInvalid={!!(errors.city && touched.city)}
                                            />
                                            <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6'>
                                            <FormLabel htmlFor="stateID">Select State</FormLabel>
                                            <Field
                                                name="stateID"
                                                as="select"
                                                placeholder="Select..."
                                                className={`form-control ${errors.stateID && touched.stateID ? 'is-invalid' : ''}`}
                                            >
                                                <option value={''} disabled>Select ...</option>
                                                {stateList?.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                                            </Field>
                                            <ErrorMessage name="stateID" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6 mb-2'>
                                            <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
                                            <Field
                                                name="zipCode"
                                                type="text"
                                                placeholder='-'
                                                as={FormControl}
                                                isInvalid={!!(errors.zipCode && touched.zipCode)}
                                            />
                                            <ErrorMessage name="zipCode" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <FormGroup className='col-12 col-md-6'>
                                            <FormLabel htmlFor="countryID">Select Country</FormLabel>
                                            <Field
                                                name="countryID"
                                                as="select"
                                                placeholder="Select..."
                                                className={`form-control ${errors.countryID && touched.countryID ? 'is-invalid' : ''}`}
                                            >
                                                <option value={''} disabled>Select ...</option>
                                                {countryList?.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                                            </Field>
                                            <ErrorMessage name="countryID" component="div" className="invalid-feedback" />
                                        </FormGroup>
                                        <div className='col-12 my-2'>
                                            <Button type="button" variant="primary" className='w-100' onClick={() => setActiveStep(checkoutSteps[1].slug)} disabled={userData?.cart?.length <= 0 || !(dirty && isValid)}>
                                                Proceed to Next Step
                                            </Button>
                                        </div>
                                    </div>
                                : activeStep === checkoutSteps[1].slug ?
                                    <div className='row border shadow-lg p-2 rounded my-2 my-md-4'>
                                        <div className='text-center text-light fs-4 border-bottom'>Ordered Items</div>
                                        {userData?.cart?.length > 0 ? 
                                            <div className='d-flex gap-3 my-2 my-md-4 flex-column'>
                                                {userData?.cart.map((item, index) => (
                                                    <React.Fragment key={item.id}>
                                                        <div className='w-100 d-flex align-items-center'>
                                                            <div className='d-flex gap-2 w-75'>
                                                                <img src={item.coverImage} width={50} height={50} className='rounded object-fit-cover' />
                                                                <div>
                                                                    <div className='fs-6 '>{item.productName}</div>
                                                                    <div className='max-content'>₹ {item.productPrice}</div>
                                                                </div>
                                                            </div>
                                                            <div className='d-flex gap-2 w-25'>
                                                                <div>{item.productQuantity} {item.productQuantity > 1 ? 'PCs' : 'PC'}</div> |
                                                                <div>₹ {item.productPrice * item.productQuantity}/-</div>
                                                            </div>
                                                        </div>
                                                        {index < userData?.cart.length - 1 && <hr className='my-0' /> }
                                                    </React.Fragment>
                                                ))}
                                                <div className='d-flex gap-2 w-100 flex-column'>
                                                    <hr className='my-0' />
                                                    <div className='w-100 d-flex align-items-center'> 
                                                        <div className='w-75'>SubTotal</div>
                                                        <div className='w-25'>₹ {submissionData.subTotal}/-</div>
                                                    </div>
                                                    <hr className='my-0' />
                                                    <div className='w-100 d-flex align-items-center'> 
                                                        <div className='w-75'>Total Tax</div>
                                                        <div className='w-25'>
                                                            + ₹ {submissionData.totalTax}/-
                                                        </div>
                                                    </div>
                                                    <hr className='my-0' />
                                                    <div className='w-100 d-flex align-items-center'> 
                                                        <div className='w-75'>Total Amount</div>
                                                        <div className='w-25'>₹ {submissionData.totalAmount}/-</div>
                                                    </div>
                                                    <hr className='my-0' />
                                                    <div className='w-100 d-flex align-items-center'> 
                                                        <div className='w-75'>Apply Coupon</div>
                                                        <div className='w-25 d-flex gap-2'>
                                                        <input 
                                                            type='text' 
                                                            className='form-control' 
                                                            placeholder='Coupon Code' 
                                                            value={couponCode} 
                                                            readOnly={loading.isValidCoupon}
                                                            onChange={(e) => {
                                                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                                setCouponCode(value);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if ((couponCode.length >= 20 && e.key !== 'Backspace' && e.key !== 'Tab') || (!/[A-Za-z0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab')) {
                                                                e.preventDefault();
                                                                }
                                                            }}
                                                            onDoubleClick={handleReEditCoupon}
                                                        />
                                                            <Button type='button' size='sm' disabled={loading.isValidCoupon || loading.isVerifying} onClick={handleCouponValidation}>Apply</Button>
                                                        </div>
                                                    </div>
                                                    <hr className='my-0' />
                                                    <div className='w-100 d-flex align-items-center'> 
                                                        <div className='w-75'>Applied Discount</div>
                                                        <div className='w-25'>- ₹ {submissionData.discount}/-</div>
                                                    </div>
                                                    <hr className='my-0' />
                                                    <div className='w-100 d-flex align-items-center'> 
                                                        <div className='w-75'>Final Amount</div>
                                                        <div className='w-25'>₹ {submissionData.finalAmount}/-</div>
                                                    </div>
                                                </div>
                                                <Button type="submit" variant="primary" className='w-100' disabled={loading.isVerifying}>
                                                    Proceed to Checkout
                                                </Button>
                                            </div> 
                                            : <div className='text-light text-center my-2 my-md-4'>No items in cart!</div>
                                        }
                                    </div>
                                : 
                                <div className='row border shadow-lg p-2 rounded my-2 my-md-4'>
                                    <div className='text-center text-light fs-4 border-bottom'>Payment Confirmation</div>
                                    <div className='my-2 my-md-4'>
                                        <div className='my-2'>Select Payment Mode</div>
                                        <select className='form-control' defaultValue={''} value={orderDetails.paymentMode} onChange={(e) => setOrderDetails(prev => ({...prev, paymentMode: e.target.value}))}>
                                            <option value={''} className='bg-light' readOnly>Select</option>
                                            <option value={'COD'} className='bg-light' readOnly>COD</option>
                                            <option value={'Online'} className='bg-light' readOnly>Online Payment</option>
                                        </select>
                                        <Button type='button' className='my-2 my-md-4 w-100' onClick={handlePaymentConfirmation} disabled={orderDetails.paymentMode === ''}>Continue Payment</Button>
                                    </div>
                                </div>
                                }
                            </Form>                                 

                        )
                    }}
                </Formik>
                {loading.paymentMade && <PaymentConfirmation data={orderDetails} />}
            </div>
        </section>
    )
}

export default Checkout