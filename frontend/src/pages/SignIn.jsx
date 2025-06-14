import { useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleRequestCode = async () => {
    try {
      await axios.post('/auth/signup', { email });
      setStep(2);
    } catch {
      alert('Error sending code');
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post('/auth/signin', {
        email,
        verificationCode: code,
      });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user_id', email);
      navigate('/dashboard');
    } catch {
      alert('Invalid code or email');
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      backgroundColor: '#fff',
      overflow: 'hidden'
    }}>
      {/* Left graphic (bottom aligned) */}
      <div style={{
        backgroundImage: 'url(/images/left-graphic.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom left',
        backgroundSize: 'contain',
      }} />

      {/* Center form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          backgroundColor: '#fff',
        }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: '200px', marginBottom: '12px', marginTop: '12px' }}
          />
          {step === 1 && (
            <>
              <h3 style={{ marginBottom: '20px' }}>Log in to continue</h3>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px',
                  margin: '16px 0',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <button
                onClick={handleRequestCode}
                style={{
                  width: '100%',
                  backgroundColor: '#0a53f0',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ marginBottom: '20px' }}>Email Verification</h3>
              <p>Please enter the code sent to your email address</p>
              <input
                type="text"
                placeholder="Enter code verification"
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '16px 0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={handleVerify}
                style={{
                  width: '100%',
                  backgroundColor: '#0a53f0',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                Submit
              </button>
            </>
          )}

          <p style={{ fontSize: '12px', marginTop: '16px', color: '#888' }}>
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </div>

      {/* Right graphic (bottom aligned) */}
      <div style={{
        backgroundImage: 'url(/images/right-graphic.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundSize: 'contain',
      }} />
    </div>
  );
}

export default SignIn;
