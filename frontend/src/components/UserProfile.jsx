import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const UserProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get('/users/me')
      .then(res => setUser(res.data))
      .catch(err => console.error('GET /users/me error', err));
  }, []);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put('/users/me', user)
      .then(() => alert('Profile updated!'))
      .catch(err => {
        console.error('PUT /users/me error', err);
        alert('Failed to update profile');
      });
  };

  return (
    <div>
      <h3>My Profile</h3>
      <input
        name="name"
        value={user.name || ''}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        name="email"
        value={user.email || ''}
        onChange={handleChange}
        placeholder="Email"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserProfile;