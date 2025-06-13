import { useEffect, useState } from 'react';
import axios from '../utils/api';

export const useInvitations = () => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    axios.get('/boards/user/invites/all')
      .then(res => setInvites(res.data))
      .catch(err => console.error("Fetch invites failed", err));
  }, []);

  const respond = async (inviteId, boardId, status) => {
    try {
      await axios.post(`/boards/${boardId}/invite/accept`, {
        invite_id: inviteId,
        status
      });
      setInvites(prev => prev.filter(inv => inv.id !== inviteId));
    } catch (err) {
      console.error("Invite response failed", err);
    }
  };

  return { invites, respond };
};
