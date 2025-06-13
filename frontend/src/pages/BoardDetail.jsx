import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/api';

function BoardDetail() {
  const { id: boardId } = useParams();
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ name: '', description: '' });
  const [editingCardId, setEditingCardId] = useState(null);
  const [editedCard, setEditedCard] = useState({ name: '', description: '' });
  const [boardName, setBoardName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    axios.get(`/boards/${boardId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setBoardName(res.data.name))
    .catch(err => console.error("Failed to fetch board name", err));

    axios.get(`/boards/${boardId}/cards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setCards(res.data))
      .catch(err => console.error("Failed to fetch cards", err));
  }, [boardId, token, userId]);

  const createCard = () => {
    axios.post(`/boards/${boardId}/cards`, newCard, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setCards(prev => [...prev, res.data]);
        setNewCard({ name: '', description: '' });
      })
      .catch(console.error);
  };

  const handleUpdateCard = async (cardId, updatedData) => {
    try {
      const res = await axios.put(
        `/boards/${boardId}/cards/${cardId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = res.data;
      setCards(prev =>
        prev.map(c => (c.id === cardId || c._id === cardId ? updated : c))
      );
      setEditingCardId(null);
    } catch (err) {
      console.error("Failed to update card", err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`/boards/${boardId}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(prev => prev.filter(card => card.id !== cardId && card._id !== cardId));
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  };

  const handleInvite = async (cardId) => {
    try {
      await axios.post(`/boards/${boardId}/cards/${cardId}/invite`, {
        board_owner_id: userId,
        email_member: inviteEmail,
        status: "pending",
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Invite sent!");
      setInviteEmail('');
    } catch (err) {
      console.error("Invite failed", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cards in Board: {boardName}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCard();
        }}
        className="flex gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Card name"
          value={newCard.name}
          onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
          className="flex-1 border px-3 py-2 rounded h-11"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newCard.description}
          onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
          className="flex-1 border px-3 py-2 rounded h-11"
        />
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded h-11"
        >
          Add Card
        </button>
      </form>

      {cards.length === 0 ? (
        <p className="text-gray-500 mt-4">No cards found.</p>
      ) : (
        <ul className="space-y-4 mt-6">
          {cards.map(card => (
            <li key={card.id || card._id} className="border p-4 rounded bg-gray-50">
              {editingCardId === (card.id || card._id) ? (
                <>
                  <input
                    className="border p-1 rounded w-full mb-2"
                    value={editedCard.name}
                    onChange={(e) =>
                      setEditedCard({ ...editedCard, name: e.target.value })
                    }
                  />
                  <textarea
                    className="border p-1 rounded w-full mb-2"
                    value={editedCard.description}
                    onChange={(e) =>
                      setEditedCard({ ...editedCard, description: e.target.value })
                    }
                  />
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleUpdateCard(card.id || card._id, editedCard)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditingCardId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">Card name: {card.name}</h3>
                  <p className="text-gray-600 text-sm">Description: {card.description}</p>
                  <p className="text-sm text-gray-500">Tasks: {card.tasks_count}</p>

                  {card.list_member?.length > 0 && (
                    <div className="text-sm text-gray-700 mt-2">
                      <p className="font-medium mb-1">Members:</p>
                      <ul className="list-disc list-inside">
                        {card.list_member.map((id) => (
                          <li key={id}>{id}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Invite by email"
                      className="border px-2 py-1 rounded w-60"
                    />
                    <button
                      onClick={() => handleInvite(card.id || card._id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded"
                    >
                      + Invite
                    </button>
                  </div>

                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => navigate(`/boards/${boardId}/cards/${card.id || card._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      View Tasks →
                    </button>
                    <button
                      onClick={() => {
                        setEditingCardId(card.id || card._id);
                        setEditedCard({
                          name: card.name,
                          description: card.description,
                        });
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id || card._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BoardDetail;