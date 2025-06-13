import { useState } from "react";

export default function CardItem({ card, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editedCard, setEditedCard] = useState({
    title: card.title,
    description: card.description,
  });

  const handleUpdate = async () => {
    await onUpdate(card.id || card._id, editedCard);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-4 transition-all hover:shadow-md">
      {editing ? (
        <div className="space-y-2">
          <input
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={editedCard.title}
            onChange={(e) =>
              setEditedCard({ ...editedCard, title: e.target.value })
            }
          />
          <textarea
            className="w-full border px-3 py-2 rounded h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={editedCard.description}
            onChange={(e) =>
              setEditedCard({ ...editedCard, description: e.target.value })
            }
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">Card name: {card.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">Description: {card.description}</p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(card.id || card._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
