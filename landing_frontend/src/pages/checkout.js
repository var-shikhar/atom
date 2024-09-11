import React from 'react'
import { useAuthContext } from '../context/authContext'
import { Button, FormCheck, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import useOrder from '../hooks/useOrder'
import VALIDATION from '../util/validation'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { FireToast } from '../context/toastContext'
import NavSteps from '../component/navStep'

const Checkout = () => {
    const { userID, userData } = useAuthContext()
    const { countryList, stateList, handleAddtoCart, handleCheckout, activeStep, checkoutSteps } = useOrder()
    return (
        <section className='body-warpper checkout-warpper'>
            <div className='container text-light'>
                <div className='display-4 heading'>Checkout</div>
                <NavSteps list={checkoutSteps} activeNav={activeStep} />
                <div className='row my-2 my-md-4'>
                    <div className='col-md-7 col-12'>

                        <Formik
                            initialValues={{
                                userID: userID,
                                buyerName: '',
                                buyerPhone: '',
                                bilingAddress: '',
                                isSimilar: false,
                                shippingAddress: '',
                                city: '',
                                stateID: '',
                                zipCode: '',
                                countryID: '',
                            }}
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
                                    <Form className='row rounded border shadow-lg p-2'>
                                        <div className='text-center text-light fs-4 border-bottom'>Buyer Details</div>
                                        <FormGroup className='col-12 mb-2 mt-md-4'>
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
                                        <FormGroup className='col-12 mb-2'>
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
                                        <Button type="submit" variant="primary" className='my-2' disabled={userData?.cart?.length <= 0 || !(dirty && isValid)}>
                                            Submit Order
                                        </Button>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                    <div className='col-md-5 col-12 h-auto'>
                        <div className='border rounded p-2 bg-gray'>
                            <div className='text-center my-2 mb-md-4 fs-5 text-light border-bottom'>Ordered Items</div>
                            {userData?.cart?.length > 0 ? 
                                <div className='d-flex gap-3 flex-column bg-gray'>
                                    {userData?.cart.map((item) => (
                                    <div key={item.id} className='w-100 d-flex g-0'>
                                        <div className='w-25 d-flex align-items-center justify-content-center'>
                                            <img src={item.coverImage} className='w-75 rounded object-fit-cover' />
                                        </div>
                                        <div className='w-75 px-2 d-flex flex-column gap-2'>
                                            <div className='fs-6 bg-gray'>{item.productName}</div>
                                            <div className='bg-gray max-content'>₹ {item.productPrice}/Item  = ₹ {item.productPrice * item.productQuantity}/-</div>
                                            <div className='d-flex gap-2 align-items-center bg-gray'>
                                                <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(item.productId, item.variationID, item.isVariation, 'Subtract', false)}>
                                                    <FaMinusCircle/>
                                                </Button>
                                                <div className='bg-light rounded px-2 fs-6 text-dark'>{item.productQuantity}</div>
                                                <Button type='button' className='border-light' size='sm' onClick={() => handleAddtoCart(item.productId, item.variationID, item.isVariation, 'Add', false)}>
                                                    <FaPlusCircle />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div> 
                                : <div className='text-light text-center my-2 my-md-4'>No items in cart!</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Checkout