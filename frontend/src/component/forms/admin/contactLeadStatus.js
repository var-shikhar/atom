import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from 'react-bootstrap';
import { FireToast } from '../../../context/toastContext';
import useAxioRequests from '../../../function/axioRequest';
import CONSTANT from '../../../util/constant';
import ROUTES from '../../../util/routes';
import VALIDATION from '../../../util/validation';

const { CONTACT_LEAD_STATUS } = CONSTANT; 

const ContactLeadStatusForm = ({ id = '', handleConfirmation }) => {
    const { HandlePostRequest } = useAxioRequests();

    return (
        <Formik
            initialValues={{
                leadID: id, 
                statusID: '',
            }}
            enableReinitialize
            validationSchema={VALIDATION.contactLeadStatusFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const response = await HandlePostRequest({
                        route: ROUTES.commonContactLeadRoute,
                        data: values,
                        type: 'put',
                        toastDescription: 'Status has updated successfully!'
                    })
                    if(response?.status === 200) handleConfirmation()
                } catch (err) {
                    console.log(err);
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Status Updation failed' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid }) => {
                return (
                    <Form className='row'>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="statusID">Select Stautus</FormLabel>
                            <Field
                                name="statusID"
                                as="select"
                                placeholder="Select..."
                                className={`form-control ${errors.statusID && touched.statusID ? 'is-invalid' : ''}`}
                            >
                                <option value={''} disabled>Select ...</option>
                                {CONTACT_LEAD_STATUS?.map(item => <option key={item.id} value={item.slug}>{item.status}</option>)}
                            </Field>
                            <ErrorMessage name="statusID" component="div" className="invalid-feedback" />
                        </FormGroup>


                        <div className='col-12 my-2 my-md-4'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                Update Lead Status
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default ContactLeadStatusForm;
