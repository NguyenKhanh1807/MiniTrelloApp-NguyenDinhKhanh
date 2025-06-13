import { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editedBoard, setEditedBoard] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/boards', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBoards(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const createBoard = () => {
    axios.post('/boards', { name, description: desc }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setBoards(prev => [...prev, res.data]);
        setName('');
        setDesc('');
      })
      .catch(err => console.error(err));
  };

  const handleUpdateBoard = async (boardId) => {
    try {
      const res = await axios.put(`/boards/${boardId}`, editedBoard, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(prev => prev.map(b => (b.id === boardId || b._id === boardId ? res.data : b)));
      setEditingBoardId(null);
    } catch (err) {
      console.error("Failed to update board", err);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await axios.delete(`/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(prev => prev.filter(b => b.id !== boardId && b._id !== boardId));
    } catch (err) {
      console.error("Failed to delete board", err);
    }
  };

  const inviteToBoard = async (boardId) => {
    const email = prompt("Enter email to invite:");
    if (!email) return;
    try {
      await axios.post(`/boards/${boardId}/invite`, {
        email_member: email,
        status: "pending"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Invitation sent!");
    } catch (err) {
      console.error("Invite failed", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Mini Trello</h1>
      <input
        placeholder="Board name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <button onClick={createBoard}>Create Board</button>
      <button onClick={() => navigate('/profile')}>My Profile</button>

      <ul style={{ marginTop: 20 }}>
        {boards.map(board => (
          <li key={board.id || board._id} style={{ marginBottom: 10 }}>
            {editingBoardId === (board.id || board._id) ? (
              <>
                <input
                  value={editedBoard.name}
                  onChange={(e) => setEditedBoard({ ...editedBoard, name: e.target.value })}
                  placeholder="Board name"
                />
                <input
                  value={editedBoard.description}
                  onChange={(e) => setEditedBoard({ ...editedBoard, description: e.target.value })}
                  placeholder="Description"
                />
                <button onClick={() => handleUpdateBoard(board.id || board._id)}>Save</button>
                <button onClick={() => setEditingBoardId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => navigate(`/boards/${board.id || board._id}`)}
                >
                  {board.name} – {board.description}
                </span>
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    setEditingBoardId(board.id || board._id);
                    setEditedBoard({ name: board.name, description: board.description });
                  }}
                >
                  Edit
                </button>
                <button
                  style={{ marginLeft: 5, color: 'red' }}
                  onClick={() => handleDeleteBoard(board.id || board._id)}
                >
                  Delete
                </button>
                <button
                  style={{ marginLeft: 5 }}
                  onClick={() => inviteToBoard(board.id || board._id)}
                >
                  Invite
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
