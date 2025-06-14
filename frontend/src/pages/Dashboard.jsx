import { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [boards, setBoards] = useState([]);
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

  const createBoard = async () => {
    const name = prompt('Enter board name:');
    if (!name) return;
    const description = prompt('Enter board description:') || '';
    try {
      const res = await axios.post('/boards', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to create board', err);
    }
  };

  const handleUpdateBoard = async (id) => {
    try {
      const res = await axios.put(`/boards/${id}`, editedBoard, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(prev => prev.map(b => (b.id === id || b._id === id ? res.data : b)));
      setEditingBoardId(null);
    } catch (err) {
      console.error('Failed to update board', err);
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      await axios.delete(`/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoards(prev => prev.filter(b => b.id !== id && b._id !== id));
    } catch (err) {
      console.error('Failed to delete board', err);
    }
  };

  const inviteToBoard = async (id) => {
    const email = prompt('Enter email to invite:');
    if (!email) return;
    try {
      await axios.post(`/boards/${id}/invite`, { email_member: email, status: 'pending' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Invitation sent!');
    } catch (err) {
      console.error('Invite failed', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: 250,
        backgroundColor: '#0e1525',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        height: '100vh'
      }}>
        <img src="/logo.png" alt="Logo" style={{ width: 100, height: 70, marginBottom: 32, marginLeft: 50 }} />
        <button style={{
          background: 'transparent',
          border: 'none',
          color: '#91a7ff',
          marginBottom: 20,
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          marginLeft: 8
        }}>
          <span style={{ marginLeft: 8 }}>Boards</span>
        </button>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: '#c792ea',
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          marginLeft: 8
        }}>
          <span style={{ marginLeft: 8 }}>All Members</span>
        </button>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, backgroundColor: '#1c2333', color: 'white', padding: '40px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>YOUR WORKSPACES</h2>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: 'red', textAlign: 'center', lineHeight: '36px'
          }}>
            <strong>SD</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {boards.map(board => {
            const id = board.id || board._id;
            return (
              <div key={id} style={{
                width: 200, backgroundColor: '#fff', borderRadius: 12,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)', padding: 16, color: '#222',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                {editingBoardId === id ? (
                  <>
                    <input
                      value={editedBoard.name}
                      onChange={(e) => setEditedBoard({ ...editedBoard, name: e.target.value })}
                      placeholder="Name"
                      style={{ marginBottom: 8 }}
                    />
                    <input
                      value={editedBoard.description}
                      onChange={(e) => setEditedBoard({ ...editedBoard, description: e.target.value })}
                      placeholder="Description"
                      style={{ marginBottom: 8 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button onClick={() => handleUpdateBoard(id)}>Save</button>
                      <button onClick={() => setEditingBoardId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={() => navigate(`/boards/${id}`)} style={{ cursor: 'pointer' }}>
                      <strong style={{ fontSize: 16 }}>{board.name}</strong>
                      <p style={{ fontSize: 12, color: '#666' }}>{board.description}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                      <button onClick={() => {
                        setEditingBoardId(id);
                        setEditedBoard({ name: board.name, description: board.description });
                      }} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px' }}>✏️</button>
                      <button onClick={() => handleDeleteBoard(id)} style={{ background: '#111', color: 'red', border: 'none', borderRadius: 6, padding: '4px 8px' }}>🗑️</button>
                      <button onClick={() => inviteToBoard(id)} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px' }}>📨</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Create board card */}
          <div onClick={createBoard} style={{
            width: 200, height: 120, backgroundColor: '#2f3b52',
            border: '2px dashed #4e5a71', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#aaa', fontSize: 16, cursor: 'pointer'
          }}>
            + Create a new board
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
