import { useState, useCallback, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Page,
    Card,
    TextField,
    Button,
    FormLayout,
    Text,
    Checkbox,
    LegacyStack
} from '@shopify/polaris';
import style from "../styles/login.module.css";
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    },[navigate]);

    const validateEmail = (value) => {
        if (!value) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (value) => {
        if (!value) {
            return 'Password is required';
        }
        if (value.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return '';
    };

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);

        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);

        if (!emailValidationError && !passwordValidationError) {
            try {
                await login(email, password, checked);
                toast.success('Login successful!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } catch (error) {
                toast.error('Login failed. Please try again.');
            }
        }
    }, [email, password, navigate]);

    const handleChange = useCallback(
        (newChecked) => setChecked(newChecked),
        [],
    );

    const handleEmailChange = useCallback((value) => {
        setEmail(value);
        setEmailError(validateEmail(value));
    }, []);

    const handlePasswordChange = useCallback((value) => {
        setPassword(value);
        setPasswordError(validatePassword(value));
    }, []);

    return (
        <div className={style.mainLoginContainer}>
            <Page narrowWidth>
                <LegacyStack vertical alignment="center">
                    <div className={style.mainHeading}>
                        <Text variant="heading2xl" as="h3">
                            Standalone
                        </Text>
                    </div>
                </LegacyStack>
                <div className={style.loginCard}>
                    <Card sectioned>
                        <form onSubmit={handleLogin}>
                            <LegacyStack vertical>
                                <div className={style.loginCardheader}>
                                    <Text variant="headingLg" as="h5" alignment="center">
                                        Login
                                    </Text>
                                    <Text variant="bodyMd" as="p" alignment="center">
                                        Enter your credentials to continue
                                    </Text>
                                </div>
                            </LegacyStack>

                            <FormLayout alignment="center">
                                <TextField
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    autoComplete="email"
                                    placeholder='Email Address'
                                    error={emailError}
                                />

                                <TextField
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    autoComplete="current-password"
                                    placeholder='Password'
                                    error={passwordError}
                                />
                                <Checkbox
                                    label="Remember Me"
                                    checked={checked}
                                    onChange={handleChange}
                                />
                                <div className={style.signInBtn}>
                                    <Button variant="primary" submit>Sign In</Button>
                                </div>
                            </FormLayout>
                        </form>
                    </Card>
                </div>
            </Page>
        </div>
    );
};

export default Login;