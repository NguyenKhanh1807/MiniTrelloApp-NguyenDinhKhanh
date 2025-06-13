import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GithubLoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      alert("Authentication failed.");
      navigate('/');
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
}

export default GithubLoginSuccess;