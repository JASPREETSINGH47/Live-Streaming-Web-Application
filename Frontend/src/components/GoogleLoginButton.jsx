import { useEffect } from 'react';

const GoogleLoginButton = () => {
  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: '943955036773-tjobdnt3o9rklbn1a0huijcefomujsgv.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });
    window.google?.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Encoded JWT ID token: ' + response.credential);
    // You can now send this token to your backend to verify and log the user in
  };

  return <div id="google-login-button"></div>;
};

export default GoogleLoginButton;
