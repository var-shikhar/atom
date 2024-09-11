import * as Yup from 'yup';

const loginFormValidation = Yup.object().shape({
    userEmail: Yup.string()
    .email('Invalid Email Address')
    .required('Password is required'),
    userPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number',
        ),
});
const registrationFormValidation = Yup.object().shape({
    firstName: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    lastName: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    userPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number',
        ),
    userEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    userPhone: Yup.string()
        .required('Phone number is required')
        .matches(
            /^[0-9]{10}$/,
            'Phone number must be exactly 10 digits',
        ),
    
});
const forgotPasswordFormValidation = Yup.object().shape({
    userEmail: Yup.string()
    .email('Invalid Email Address')
    .required('Password is required')
});
const passwordResetFormValidation = Yup.object().shape({
    newPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Please confirm your password')
});



const contactFormValidation = Yup.object().shape({
    firstName: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    lastName: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    message: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(500, 'Maximum 500 characters are allowed')
        .optional(),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(
            /^[0-9]{10}$/,
            'Phone number must be exactly 10 digits',
        ),
    
});
const checkoutFormValidation = Yup.object().shape({
    buyerName: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    buyerPhone: Yup.string()
        .required('Phone number is required')
        .matches(
            /^[0-9]{10}$/,
            'Phone number must be exactly 10 digits',
        ),
    city: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    zipCode: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(100, 'Maximum 100 characters are allowed')
        .required('Required field!'),
    bilingAddress: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(500, 'Maximum 500 characters are allowed')
        .required('Required field!'),
    shippingAddress: Yup.string()
        .min(3, 'Minimum 3 characters are required')
        .max(500, 'Maximum 500 characters are allowed')
        .required('Required field!'),
    stateID: Yup.string().notOneOf([''], 'Please select an valid option').required('Required field!'),
    countryID: Yup.string().notOneOf([''], 'Please select an valid option').required('Required field!'),    
});

const VALIDATION = {
    loginFormValidation, registrationFormValidation, forgotPasswordFormValidation, passwordResetFormValidation,
    contactFormValidation, checkoutFormValidation,
}

export default VALIDATION;