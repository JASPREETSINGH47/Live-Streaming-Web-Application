import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginModal = ({ show, onClose, theme }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.prompt();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (show) {
      setStep(1);
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setIsLoading(false);
    }
  }, [show]);

  const handleCredentialResponse = (response) => {
    const token = response.credential;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    const user = JSON.parse(jsonPayload);
    console.log("Google user:", user);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}auth/google-login`,
          { access_token: tokenResponse.access_token }
        );
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onClose();
      } catch (err) {
        console.error('Google login error:', err);
      }
    },
    onError: (errorResponse) => console.error('Google login failed', errorResponse),
  });
  //Usercreate API handle
  const handleUserCreate = async (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}users/create`,
        { first_name, last_name, email, password, confirm_password }
      );
      console.log('User Created Successful:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.hellCastUser.id);
      onClose();
    } catch (error) {
      console.error('Sign-up failed:', error.message);
      setShowFail(true);
    } finally {
      setIsLoading(false);
    }
  };
  // Login API handle
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}users/login`,
        {
          email, password,
        }
      );
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setShowFail(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    step > 1 ? setStep(1) : onClose();
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(confirm_password && value !== confirm_password ? 'Passwords do not match' : '');
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(password && value !== password ? 'Passwords do not match' : '');
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(2px)'
    }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
        <div className="modal-content" style={{
          backgroundColor: `var(--twitch-dark-secondary)`,
          border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <div className="modal-header border-0 position-relative">
            {step !== 1 && (
              <button type="button" className="btn btn-sm position-absolute start-0" onClick={handleBack}
                style={{ color: `var(--twitch-text)` }}>
                <FiArrowLeft size={18} />
              </button>
            )}
            <h5 className="modal-title mx-auto" style={{ color: `var(--twitch-text)`, fontWeight: '600' }}>
              {step === 1 ? 'Log in to Hell Cast' : step === 2 ? 'Sign up with Email' : 'Login with Email'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}
              style={{ filter: theme === 'dark' ? 'invert(1)' : 'invert(0)', fontSize: '12px' }} />
          </div>

          <div className="modal-body px-4 pb-4">
            {step === 1 && (
              <div className="text-center">
                <button
                  className="btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center py-2"
                  onClick={loginWithGoogle}
                  style={{
                    borderColor: `var(--twitch-dark-tertiary)`,
                    color: `var(--twitch-text)`
                  }}
                >
                  <FcGoogle size={20} className="me-2" />
                  Continue with Google
                </button>

                <button
                  className="btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center py-2"
                  onClick={() => setStep(3)} // login with email
                  style={{
                    borderColor: `var(--twitch-dark-tertiary)`,
                    color: `var(--twitch-text)`
                  }}
                >
                  <FiMail size={18} className="me-2" />
                  Login with Email
                </button>

                <button
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-2"
                  onClick={() => setStep(2)} // signup
                  style={{
                    borderColor: `var(--twitch-dark-tertiary)`,
                    color: `var(--twitch-text)`
                  }}
                >
                  <FiMail size={18} className="me-2" />
                  Create New Account
                </button>

                <p className="small mt-3 mb-0" style={{ color: `var(--twitch-text-secondary)` }}>
                  By logging in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}


            {step === 2 && (
              <form onSubmit={handleUserCreate}>
                <div className="mb-3">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>First Name</label>
                  <input type="text" className="form-control py-2" value={first_name} onChange={(e) => setFirstName(e.target.value)} required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }} />
                </div>

                <div className="mb-3">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>Last Name</label>
                  <input type="text" className="form-control py-2" value={last_name} onChange={(e) => setLastName(e.target.value)} required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }} />
                </div>

                <div className="mb-3">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>Email</label>
                  <input type="email" className="form-control py-2" value={email} onChange={(e) => setEmail(e.target.value)} required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }} />
                </div>

                <div className="mb-3">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>Password</label>
                  <input type="password" className={`form-control py-2 ${passwordError ? 'is-invalid' : ''}`} value={password}
                    onChange={handlePasswordChange} required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }} />
                  {passwordError && <div className="invalid-feedback">Passwords do not match</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>Confirm Password</label>
                  <input type="password" className={`form-control py-2 ${passwordError ? 'is-invalid' : ''}`} value={confirm_password}
                    onChange={handleConfirmPasswordChange} required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }} />
                </div>

                <button type="submit" className="btn w-100 py-2"
                  style={{ backgroundColor: `var(--twitch-purple)`, color: 'white', height: '44px' }}
                  disabled={isLoading || !!passwordError}>
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : 'Sign Up'}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleEmailLogin}>
                <div className="mb-3">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label mb-2" style={{ color: `var(--twitch-text)` }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      backgroundColor: `var(--twitch-dark-tertiary)`,
                      borderColor: `var(--twitch-dark-tertiary)`,
                      color: `var(--twitch-text)`,
                      height: '44px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-2"
                  style={{
                    backgroundColor: `var(--twitch-purple)`,
                    color: 'white',
                    height: '44px'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
