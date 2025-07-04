import { useState, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  TextField,
  Button,
  FormLayout,
  Text,
  Checkbox,
  LegacyStack,
} from '@shopify/polaris';
import toast from 'react-hot-toast';
import style from '../styles/login.module.css';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [lastTried, setLastTried] = useState({ email: '', password: '' });
  const [errorShown, setErrorShown] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return password.length >= 6 ? '' : 'Password must be at least 6 characters long';
  };

  const handleInputChange = useCallback((field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: field === 'email' ? validateEmail(value) : validatePassword(value),
    }));
  }, []);

  // const handleLogin = useCallback(
  //   async (e) => {
  //     e.preventDefault();

  //     const emailErr = validateEmail(form.email);
  //     const passErr = validatePassword(form.password);
  //     setErrors({ email: emailErr, password: passErr });

  //     if (!emailErr && !passErr) {
  //       try {
  //         await login(form.email, form.password, rememberMe);
  //         toast.success('Login successful!');
  //         setTimeout(() => navigate('/'), 1500);
  //       } catch (error) {
  //         toast.error('Invalid email or password. Please check your credentials and try again.');
  //       }
  //     }
  //   },
  //   [form, rememberMe, login, navigate]
  // );


const handleLogin = useCallback(
  async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    setErrors({ email: emailErr, password: passErr });

    const sameAsLast = 
      form.email === lastTried.email && 
      form.password === lastTried.password;

    //Block if same invalid input retried
    if (!emailErr && !passErr && (!sameAsLast || !errorShown)) {
      setLoading(true);
      try {
        await login(form.email, form.password, rememberMe);
        toast.success('Login successful!');
        setTimeout(() => navigate('/'), 1500);
      } catch (error) {
        if (!sameAsLast || !errorShown) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
          setErrorShown(true);
        }
        // Save last tried
        setLastTried({ email: form.email, password: form.password });
      } finally {
        setLoading(false);
      }
    }
  },
  [form, rememberMe, login, navigate, errorShown, lastTried]
);

// Reset errorShown when input changes
useEffect(() => {
  setErrorShown(false);
}, [form.email, form.password]);


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

              <FormLayout>
                <TextField
                  type="email"
                  value={form.email}
                  onChange={handleInputChange('email')}
                  autoComplete="email"
                  placeholder="Email Address"
                  error={errors.email}
                />

                <TextField
                  type="password"
                  value={form.password}
                  onChange={handleInputChange('password')}
                  autoComplete="current-password"
                  placeholder="Password"
                  error={errors.password}
                />

                <Checkbox
                  label="Remember Me"
                  checked={rememberMe}
                  onChange={setRememberMe}
                />

                <div className={style.signInBtn}>
                  <Button variant="primary" submit>
                    Sign In
                  </Button>
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
