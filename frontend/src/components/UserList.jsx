import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h3>All Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;