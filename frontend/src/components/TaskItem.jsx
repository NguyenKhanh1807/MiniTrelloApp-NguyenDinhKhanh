import { useState, useEffect, useCallback } from "react";
import { useDrag } from "react-dnd";

export default function TaskItem({ task, onDelete, onUpdate, boardId, cardId }) {
  const [editing, setEditing] = useState(false);
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [assignMsg, setAssignMsg] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
  });

  const taskId = task.id || task._id;

  const fetchAssignees = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setAssignees(data);
    } catch (err) {
      console.error("Failed to fetch assignees", err);
    }
  }, [taskId, boardId, cardId]);

  useEffect(() => {
    fetchAssignees();
  }, [fetchAssignees]);

  const handleUpdate = async () => {
    await onUpdate(taskId, editedTask);
    setEditing(false);
  };

  const handleAssign = async () => {
    if (!assigneeEmail.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:3001/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ memberId: assigneeEmail }),
        }
      );
      if (!res.ok) throw new Error("Failed to assign member");
      setAssignMsg(`Assigned to ${assigneeEmail}`);
      setAssigneeEmail("");
      fetchAssignees();
    } catch (error) {
      console.error("Failed to assign member:", error);
      setAssignMsg("Assign failed.");
    }
  };

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "task",
    item: { id: taskId, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const removeAssignee = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:3001/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${email}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to remove assignee");
      fetchAssignees();
    } catch (err) {
      console.error("Failed to remove assignee", err);
    }
  };

  return (
    <div
      ref={dragRef}
      className="bg-white rounded-xl border p-4 shadow-sm mb-3 transition-opacity"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {editing ? (
        <div className="space-y-2">
          <input
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          />
          <textarea
            className="w-full border px-3 py-2 rounded resize-none h-20 focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-base">Task title: {task.title}</h3>
              <p className="text-gray-600 text-sm">Description: {task.description}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(taskId)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
              <input
                type="email"
                placeholder="Assignee email"
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
                className="border px-3 py-1 rounded w-56 text-sm h-[500px]"
              />
              <button
                onClick={handleAssign}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                + Assign
              </button>
            </div>

          {assignMsg && (
            <p className="text-xs mt-1 text-gray-500 italic">{assignMsg}</p>
          )}

          {assignees.length > 0 && (
            <div className="mt-3 text-sm text-gray-700">
              <p className="font-medium mb-1">👥 Assigned:</p>
              <ul className="list-disc list-inside">
                {assignees.map((email) => (
                  <li key={email} className="flex justify-between items-center">
                    {email}
                    <button
                      onClick={() => removeAssignee(email)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}
