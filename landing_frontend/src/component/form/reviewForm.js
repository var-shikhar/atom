import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from 'react-bootstrap';
import ROUTES from '../../util/routes';
import VALIDATION from '../../util/validation';
import { FireToast } from '../../context/toastContext';
import useAxioRequests from '../../function/axioRequest';
import './feedback.css'
import React from 'react';

const ReviewForm = ({ id = '', productID = '', handleConfirmation }) => {
    const { HandlePostRequest } = useAxioRequests();

    async function handleProcessedFormData(values, imageKeys) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (imageKeys.includes(key) && value instanceof Blob) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null) {
                formData.append(key, String(value));
            }
        });
        return formData;
    }
    
    return (
        <Formik
            initialValues={{
                orderID: id,
                productID: productID,
                reviewText: '',
                rating: 0,
                reviewImage: null,
            }}
            enableReinitialize
            validationSchema={VALIDATION.reviewFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const processedData = await handleProcessedFormData(values, ['reviewImage'])
                    const response = await HandlePostRequest({
                        data: processedData,
                        route: ROUTES.commonReviewRoute,
                        type: 'post',
                        toastDescription: 'Review has posted successfully!'
                    })
                    if(response?.status === 200) handleConfirmation()
                } catch (err) {
                    console.log(err);
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Review posting failed!' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid, setFieldValue, values }) => {
                return (
                    <Form className='row rounded border shadow-lg p-4 m-2 text-light'>
                        <div className='col-12 my-2 fs-4'>Write a Review</div>

                        <div className="radio bg-inherit d-flex justify-content-around w-md-75 mx-auto my-2 my-md-4">
                            {[5, 4, 3, 2, 1].map((value) => (
                            <React.Fragment key={value}>
                                <input
                                    id={`rating-${value}`}
                                    type="radio"
                                    name="rating"
                                    value={value}
                                    onChange={() => setFieldValue('rating', value)}
                                />
                                <label htmlFor={`rating-${value}`} title={`${value} stars`} className="bg-transparent">
                                <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="bg-transparent">
                                    <path
                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                    ></path>
                                </svg>
                                </label>
                            </React.Fragment>
                            ))}
                        </div>

                        <FormGroup className='col-12 mb-2'>
                            <FormLabel htmlFor="reviewText" className='max-content me-auto d-block'>Review Content</FormLabel>
                            <Field
                                name="reviewText"
                                as="textarea"
                                placeholder="Write your review.."
                                rows={4}
                                className={`form-control ${errors.reviewText && touched.reviewText ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name="reviewText" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 mb-2'>
                            <FormLabel htmlFor="reviewImage"  className='max-content me-auto d-block'>Supporting Image</FormLabel>
                            <input
                                multiple
                                type='file'
                                name='reviewImage'
                                id='reviewImage'
                                className={`form-control ${errors.reviewImage && touched.reviewImage ? 'is-invalid' : ''}`}
                                onChange={e => {
                                    const files = Array.from(e.target.files);
                                    setFieldValue('reviewImage', files[0]);
                                }}
                            />
                            <small className='text-light'>Max 1 Images of 1MB is allowed.</small> 
                            <ErrorMessage name="reviewImage" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <div className='col-12 my-2'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                Post Review
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default ReviewForm;
