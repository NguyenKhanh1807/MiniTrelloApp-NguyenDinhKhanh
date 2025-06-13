import { useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleRequestCode = async () => {
    try {
      await axios.post('/auth/signup', { email });
      alert('Verification code sent to your email!');
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
    <div>
      <h2>Sign In</h2>
      <input
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleRequestCode}>Send Code</button>
      <br />
      <input
        placeholder="Enter code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>

      <hr style={{ margin: '20px 0' }} />

      <a href="http://localhost:3001/auth/github/login">
        <button style={{ backgroundColor: '#24292F', color: 'white', padding: '8px 16px', borderRadius: '5px', border: 'none' }}>
          🔐 Sign in with GitHub
        </button>
      </a>
    </div>
  );
}

export default SignIn;
