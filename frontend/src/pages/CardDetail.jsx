import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import TaskBoard from "../components/TaskBoard";
import axios from "../utils/api";

export default function CardDetail() {
  const { boardId, cardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "icebox" });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/boards/${boardId}/cards/${cardId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        setError(err.message || "Failed to load tasks.");
      }
    };

    fetchTasks();
  }, [boardId, cardId, token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const res = await axios.post(`/boards/${boardId}/cards/${cardId}/tasks`, newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prev) => [...prev, res.data]);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      setError(err.message || "Failed to create task.");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const res = await axios.put(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId || task._id === taskId ? res.data : task))
      );
    } catch (err) {
      setError(err.message || "Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId && t._id !== taskId));
    } catch (err) {
      setError(err.message || "Failed to delete task.");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Tasks in this card
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleCreateTask}
        className="mb-6 flex flex-wrap gap-4 items-center justify-center"
      >
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          className="border px-3 py-2 rounded w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="border px-3 py-2 rounded w-72 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm shadow"
        >
          Add
        </button>
      </form>

      <TaskBoard
        tasks={tasks}
        boardId={boardId}
        cardId={cardId}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}