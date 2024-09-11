import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FireToast } from '../context/toastContext';
import useGetStarted from '../hooks/useGetStarted';
import VALIDATION from '../util/validation';

const LoginComponent = ({handleModeChanges}) => {
    const { handleAuthenticationForms, modeType } = useGetStarted();
  return (
    <Formik
        initialValues={{
            userEmail: '', userPassword: '',
        }}
        enableReinitialize
        validationSchema={VALIDATION.loginFormValidation}
        onSubmit={async (values, { setSubmitting }) => {
            try {
                await handleAuthenticationForms(values, 'Login');
            } catch (err) {
                console.log(err)
                FireToast({});
            } finally {
                setSubmitting(false);   
            }
        }}
    >
        {({ errors, touched, dirty, isValid }) => (
            <Form className='w-100 rounded border shadow-lg p-4 d-flex flex-column gap-4 bg-gray'>
                <div className='h2 text-center text-light'>Login Here</div>
                <FormGroup >
                    <FormLabel htmlFor="userEmail">Email Address</FormLabel>
                    <Field
                        name="userEmail"
                        type="email"
                        placeholder='user@example.com'
                        as={FormControl}
                        isInvalid={!!(errors.userEmail && touched.userEmail)}
                    />
                    <ErrorMessage name="userEmail" component="div" className="invalid-feedback" />
                </FormGroup>  
                <FormGroup >
                    <FormLabel htmlFor="userPassword">Password</FormLabel>
                    <Field
                        name="userPassword"
                        type="password"
                        placeholder='******'
                        as={FormControl}
                        isInvalid={!!(errors.userPassword && touched.userPassword)}
                    />
                    <ErrorMessage name="userPassword" component="div" className="invalid-feedback" />
                </FormGroup>
                <div>
                    <small className='text-light ms-auto d-block max-content my-2 cursor-pointer' onClick={() => handleModeChanges(modeType[2].slug)}>Forgot Password ?</small>
                    <Button type="submit" className='w-100' disabled={!(dirty && isValid)}>
                        Sign-In
                    </Button>
                    <small className='text-light ms-auto d-block max-content my-2 cursor-pointer' onClick={() => handleModeChanges(modeType[1].slug)}>Don't have an account, Create New</small>
                </div>
            </Form>
        )}
    </Formik>
  )
}
const RegisterComponent = ({handleModeChanges}) => {
    const { handleAuthenticationForms, modeType } = useGetStarted();

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                userEmail: '', 
                userPassword: '',
                userPhone: '',
            }}
            enableReinitialize
            validationSchema={VALIDATION.registrationFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const response = await handleAuthenticationForms(values, 'Register');
                    console.log(response)
                } catch (err) {
                    console.log(err)
                    FireToast({});
                } finally {
                    setSubmitting(false);   
                }
            }}
        >
            {({ errors, touched, dirty, isValid }) => (
                <Form className='w-100 rounded border shadow-lg p-4 d-flex flex-column gap-2 bg-gray my-md-4'>
                    <div className='h2 text-center text-light'>Register Here</div>
                    <FormGroup >
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
                    <FormGroup >
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
                    <FormGroup >
                        <FormLabel htmlFor="userPhone">Phone Number</FormLabel>
                        <Field
                            name="userPhone"
                            type="number"
                            min={6666666666}
                            max={9999999999}
                            placeholder='9898XXXXXX'
                            as={FormControl}
                            isInvalid={!!(errors.userPhone && touched.userPhone)}
                        />
                        <ErrorMessage name="userPhone" component="div" className="invalid-feedback" />
                    </FormGroup> 
                    <FormGroup >
                        <FormLabel htmlFor="userEmail">Email Address</FormLabel>
                        <Field
                            name="userEmail"
                            type="email"
                            placeholder='user@example.com'
                            as={FormControl}
                            isInvalid={!!(errors.userEmail && touched.userEmail)}
                        />
                        <ErrorMessage name="userEmail" component="div" className="invalid-feedback" />
                    </FormGroup>  
                    <FormGroup >
                        <FormLabel htmlFor="userPassword">Password</FormLabel>
                        <Field
                            name="userPassword"
                            type="password"
                            placeholder='******'
                            as={FormControl}
                            isInvalid={!!(errors.userPassword && touched.userPassword)}
                        />
                        <ErrorMessage name="userPassword" component="div" className="invalid-feedback" />
                    </FormGroup>
                    <div>
                        <Button type="submit" className='w-100' disabled={!(dirty && isValid)}>
                            Register Account
                        </Button>
                        <small className='text-light ms-auto d-block max-content my-2 cursor-pointer' onClick={() => handleModeChanges(modeType[0].slug)}>Already have an account, Try Sign-In</small>

                    </div>
                </Form>
            )}
        </Formik>
  )
}
const ForgotPasswordComponent = ({handleModeChanges}) => {
    const { handlePasswordReset, modeType } = useGetStarted();
  return (
    <Formik
        initialValues={{
            userEmail: '',
        }}
        enableReinitialize
        validationSchema={VALIDATION.forgotPasswordFormValidation}
        onSubmit={async (values, { setSubmitting }) => {
            try {
                await handlePasswordReset(values, 'ForgotPassword');
            } catch (err) {
                console.log(err)
                FireToast({});
            } finally {
                setSubmitting(false);   
            }
        }}
    >
        {({ errors, touched, dirty, isValid }) => (
            <Form className='w-100 rounded border shadow-lg p-4 d-flex flex-column gap-4 bg-gray'>
                <div className='h2 text-center text-light'>Enter Email to send Reset Password Link</div>
                <FormGroup >
                    <FormLabel htmlFor="userEmail">Email Address</FormLabel>
                    <Field
                        name="userEmail"
                        type="email"
                        placeholder='user@example.com'
                        as={FormControl}
                        isInvalid={!!(errors.userEmail && touched.userEmail)}
                    />
                    <ErrorMessage name="userEmail" component="div" className="invalid-feedback" />
                </FormGroup>  
                <div>
                    <Button type="submit" className='w-100' disabled={!(dirty && isValid)}>
                        Send Reset Link
                    </Button>
                    <small className='text-light ms-auto d-block max-content my-2 cursor-pointer' onClick={() => handleModeChanges(modeType[1].slug)}>Back to Login</small>
                </div>
            </Form>
        )}
    </Formik>
  )
}
const UpdatePasswordComponent = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const validationToken = params.get('token');

    const { handlePasswordReset } = useGetStarted();
  return (
    <Formik
        initialValues={{
            token: validationToken, 
            newPassword: '', 
            confirmPassword: '',
        }}
        enableReinitialize
        validationSchema={VALIDATION.passwordResetFormValidation}
        onSubmit={async (values, { setSubmitting }) => {
            try {
                await handlePasswordReset(values, 'PasswordReset');
            } catch (err) {
                console.log(err)
                FireToast({});
            } finally {
                setSubmitting(false);   
            }
        }}
    >
        {({ errors, touched, dirty, isValid }) => (
            <Form className='w-100 rounded border shadow-lg p-4 d-flex flex-column gap-4 bg-gray'>
                <div className='h2 text-center text-light'>Update your account password</div>
                <FormGroup >
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <Field
                        name="newPassword"
                        type="password"
                        placeholder='******'
                        as={FormControl}
                        isInvalid={!!(errors.newPassword && touched.newPassword)}
                    />
                    <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                </FormGroup>
                <FormGroup >
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <Field
                        name="confirmPassword"
                        type="password"
                        placeholder='******'
                        as={FormControl}
                        isInvalid={!!(errors.confirmPassword && touched.confirmPassword)}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                </FormGroup> 
                <Button type="submit" className='w-100' disabled={!(dirty && isValid)}>
                    Update Password
                </Button>
            </Form>
        )}
    </Formik>
  )
}


const AUTH_FORMS = {LoginComponent, RegisterComponent, ForgotPasswordComponent, UpdatePasswordComponent};

export default AUTH_FORMS