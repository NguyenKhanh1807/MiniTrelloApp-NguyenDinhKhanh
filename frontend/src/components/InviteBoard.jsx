import React, { useState } from 'react';
import axios from '../utils/api';

const InviteBoard = ({ boardId }) => {
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    axios.post(`/boards/${boardId}/invite`, {
      email_member: email,
      status: 'pending'
    }).then(() => {
      alert('Invitation sent');
      setEmail('');
    }).catch(() => alert('Failed to invite'));
  };

  return (
    <div>
      <h3>Invite to Board</h3>
      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleInvite}>Send Invite</button>
    </div>
  );
};

export default InviteBoard;