import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, FormCheck, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { FireToast } from '../../../context/toastContext';
import useCouponForm from '../../../hooks/admin/forms/useCouponForm';
import VALIDATION from '../../../util/validation';

const CouponForm = ({ id = '', handleConfirmation }) => {
    const { defaultValue, handleFormSubmisstion } = useCouponForm(id);

    return (
        <Formik
            initialValues={defaultValue}
            enableReinitialize
            validationSchema={VALIDATION.couponFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await handleFormSubmisstion(values, handleConfirmation);
                } catch (err) {
                    console.log(err);
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Coupon Creation failed' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid, values, setFieldValue }) => {
                return (
                    <Form className='row rounded border shadow-lg p-4 m-2'>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="couponCode">Coupon Code</FormLabel>
                            <Field
                                name="couponCode"
                                type="text"
                                placeholder="SUMMER2024"
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                    setFieldValue('couponCode', value);
                                }}
                                onKeyPress={(e) => {
                                    if (!/[A-Za-z0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                as={FormControl}
                                isInvalid={!!(errors.couponCode && touched.couponCode)}
                            />
                            <ErrorMessage name="couponCode" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="discountType">Discount Type</FormLabel>
                            <Field
                                name="discountType"
                                as="select"
                                placeholder="Select..."
                                className={`form-control ${errors.discountType && touched.discountType ? 'is-invalid' : ''}`}
                            >
                                <option value={''} disabled>Select ...</option>
                                <option value="Percentage">Percentage</option>
                                <option value="Fixed">Fixed Amount</option>
                            </Field>
                            <ErrorMessage name="discountType" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="discountValue">Discount Value</FormLabel>
                            <Field
                                name="discountValue"
                                type="number"
                                placeholder="e.g., 10% or ₹100"
                                as={FormControl}
                                step={0.1}
                                min={0}
                                onChange={(e) => {
                                    const disValue = e.target.value;
                                    const hasPerType = values.discountType === 'Percentage';
                                    setFieldValue("discountValue", hasPerType && disValue > 100 ? 100 : disValue)
                                }}
                                isInvalid={!!(errors.discountValue && touched.discountValue)}
                            />
                            <ErrorMessage name="discountValue" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="minOrderAmount">Minimum Order Amount</FormLabel>
                            <Field
                                name="minOrderAmount"
                                type="number"
                                placeholder="e.g., ₹500"
                                as={FormControl}
                                min={0}
                                isInvalid={!!(errors.minOrderAmount && touched.minOrderAmount)}
                            />
                            <ErrorMessage name="minOrderAmount" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="maxDiscountedAmount">Maximum Discounted Amount</FormLabel>
                            <Field
                                name="maxDiscountedAmount"
                                type="number"
                                placeholder="e.g., ₹500"
                                as={FormControl}
                                min={0}
                                isInvalid={!!(errors.maxDiscountedAmount && touched.maxDiscountedAmount)}
                            />
                            <ErrorMessage name="maxDiscountedAmount" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="startDate">Start Date</FormLabel>
                            <Field
                                name="startDate"
                                type="date"
                                as={FormControl}
                                isInvalid={!!(errors.startDate && touched.startDate)}
                            />
                            <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="expirationDate">Expiration Date</FormLabel>
                            <Field
                                name="expirationDate"
                                type="date"
                                as={FormControl}
                                isInvalid={!!(errors.expirationDate && touched.expirationDate)}
                            />
                            <ErrorMessage name="expirationDate" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="limitUsage">Usage Limit</FormLabel>
                            <Field
                                name="limitUsage"
                                type="number"
                                placeholder="e.g., 5 uses"
                                as={FormControl}
                                min={0}
                                isInvalid={!!(errors.limitUsage && touched.limitUsage)}
                            />
                            <ErrorMessage name="limitUsage" component="div" className="invalid-feedback" />
                            <FormGroup className='w-100 mt-2'>
                                <FormCheck 
                                    type="checkbox"
                                    name="isActive"
                                    label="Is Active"
                                    className='text-light my-auto d-block'
                                    checked={values.isActive} 
                                    onChange={e => setFieldValue("isActive", e.target.checked)}
                                    isInvalid={!!(errors.isActive && touched.isActive)}
                                />
                                <ErrorMessage name="isActive" component="div" className="invalid-feedback" />
                            </FormGroup>
                        </FormGroup>

                        <div className='col-12 my-2 my-md-4'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                {id === '' ? 'Create New Coupon' : 'Update Coupon'}
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default CouponForm;
