import React, { useEffect, useState } from 'react';
import axios from '../utils/api';

const CardInvitations = ({ boardId }) => {
  const [invites, setInvites] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    axios.get(`/boards/${boardId}/cards/user/${userId}`)
      .then(res => setInvites(res.data.filter(c => c.status === 'pending')));
  }, [boardId, userId]);

  const handleResponse = (cardId, status) => {
    axios.post(`/boards/${boardId}/cards/${cardId}/invite/accept`, {
      invite_id: cardId,
      card_id: cardId,
      member_id: userId,
      status
    }).then(() => window.location.reload());
  };

  return (
    <div>
      <h3>Pending Card Invitations</h3>
      {invites.map(inv => (
        <div key={inv.id}>
          <span>{inv.name}</span>
          <button onClick={() => handleResponse(inv.id, 'accepted')}>Accept</button>
          <button onClick={() => handleResponse(inv.id, 'declined')}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default CardInvitations;