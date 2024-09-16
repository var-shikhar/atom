import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { FireToast } from '../../context/toastContext';
import useAxioRequests from '../../function/axioRequest';
import VALIDATION from '../../util/validation';
import ROUTES from '../../util/routes';

const ContactForm = () => {
    const {HandlePostRequest} = useAxioRequests();
  return (
    <Formik
        initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
        }}
        validationSchema={VALIDATION.contactFormValidation}
        onSubmit={async(values, {setSubmitting}) => {
            try{
                const response = await HandlePostRequest({
                    data: values,
                    route: ROUTES.commonContactRoute,
                    type: 'post',
                    toastDescription: 'Request Query has raised successfuly!'
                })
                if(response?.status === 200) window.location.reload()
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
                <Form className='row rounded border shadow-lg p-4 m-2'>
                    <FormGroup className='col-12 mb-2'>
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <Field
                            name="firstName"
                            type="text"
                            placeholder='John'
                            as={FormControl}
                            isInvalid={!!(errors.firstName && touched.firstName)}
                        />
                        <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                    </FormGroup>
                    <FormGroup className='col-12 mb-2'>
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <Field
                            name="lastName"
                            type="text"
                            placeholder='Doe'
                            as={FormControl}
                            isInvalid={!!(errors.lastName && touched.lastName)}
                        />
                        <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                    </FormGroup>
                    <FormGroup className='col-12 mb-2'>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Field
                            name="email"
                            type="email"
                            placeholder='user@example.com'
                            as={FormControl}
                            isInvalid={!!(errors.email && touched.email)}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </FormGroup>
                    <FormGroup className='col-12 mb-2'>
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <Field
                            name="phone"
                            type="number"
                            min={6666666666}
                            max={9999999999}
                            placeholder='9898-XXXXXX'
                            as={FormControl}
                            isInvalid={!!(errors.phone && touched.phone)}
                        />
                        <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                    </FormGroup>
                    <FormGroup className='col-12 mb-2'>
                        <FormLabel htmlFor="message">Message</FormLabel>
                        <Field
                            name="message"
                            as="textarea"
                            placeholder="Message.."
                            rows={4}
                            className={`form-control ${errors.message && touched.message ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage name="message" component="div" className="invalid-feedback" />
                    </FormGroup>
                    <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                        Submit
                    </Button>
                </Form>
            )
        }}
    </Formik>
  )
}

export default ContactForm