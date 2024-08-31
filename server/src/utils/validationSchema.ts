import * as yup from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message,
        name: 'email',
        excludeEmptyString: true,
    });
});

export const newUserSchema = yup.object({
    name: yup.string().required('Name is missing!'),
    email: yup.string().email('Invalid email!').required('Email is missing!'),
    password: yup
        .string()
        .required('Password is missing!')
        .min(8, 'Password should be atleast 8 characters')
        .matches(passwordRegex, 'Password should have atleast one capital letter, one number and one special letter!'),
});