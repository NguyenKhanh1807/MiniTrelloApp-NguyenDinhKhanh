import { useEffect, useState } from 'react';
import axios from '../utils/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [edited, setEdited] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const userEmail = localStorage.getItem('user_id');

  useEffect(() => {
    axios.get('/users/me')
      .then(res => {
        setUser(res.data);
        setEdited({ name: res.data.name, email: res.data.email });
      })
      .catch(console.error);
  }, []);

  const handleSave = () => {
    axios.put(`/users/${userEmail}`, edited)
      .then(res => {
        setUser(res.data);
        setEditing(false);
      })
      .catch(console.error);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {editing ? (
        <>
          <input
            value={edited.name}
            onChange={(e) => setEdited({ ...edited, name: e.target.value })}
            placeholder="Name"
            className="border px-3 py-2 rounded w-full mb-3"
          />
          <input
            value={edited.email}
            onChange={(e) => setEdited({ ...edited, email: e.target.value })}
            placeholder="Email"
            className="border px-3 py-2 rounded w-full mb-3"
          />
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded mr-2"
          >Save</button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >Cancel</button>
        </>
      ) : (
        <>
          <p className="mb-2">Name: {user.name}</p>
          <p className="mb-2">Email: {user.email}</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >Edit</button>
        </>
      )}
    </div>
  );
}

export default Profile;