import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from 'react-bootstrap';
import useAxioRequests from '../../../../frontend/src/function/axioRequest';
import ROUTES from '../../util/routes';
import VALIDATION from '../../util/validation';

const ReviewForm = ({ id = '', handleConfirmation }) => {
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
                reviewText: '',
                reviewImage: null,
            }}
            enableReinitialize
            validationSchema={VALIDATION.reviewFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const processedData = await handleProcessedFormData(values, [reviewImage])
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
            {({ errors, touched, dirty, isValid, setFieldValue }) => {
                return (
                    <Form className='row rounded border shadow-lg p-4 m-2'>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="reviewText">Review Content</FormLabel>
                            <Field
                                name="reviewText"
                                as="textarea"
                                placeholder="Write your review.."
                                rows={4}
                                className={`form-control ${errors.reviewText && touched.reviewText ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name="reviewText" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 mb-2'>
                            <FormLabel htmlFor="reviewImage">Supporting Image</FormLabel>
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

                        <div className='col-12 my-2 my-md-4'>
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
