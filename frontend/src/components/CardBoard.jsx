import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useEffect, useState, useParams } from 'react';
import TaskColumn from './TaskColumn';
import axios from '../utils/api';
import socket from '../utils/socket.js';

const STATUSES = ['icebox', 'backlog', 'ongoing', 'review', 'done'];

const CardBoard = () => {
  const { boardId, cardId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(`/boards/${boardId}/cards/${cardId}/tasks`)
      .then(res => setTasks(res.data))
      .catch(console.error);

    socket.emit('joinBoard', boardId);
    socket.on('taskUpdated', updatedTask => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    return () => socket.off('taskUpdated');
  }, [boardId, cardId]);

  const onDropTask = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const updated = { ...task, status: newStatus };

    axios.put(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}`, updated)
      .then(res => {
        setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
        socket.emit('taskUpdated', { boardId, task: res.data });
      })
      .catch(console.error);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        {STATUSES.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter(task => task.status === status)}
            onDropTask={onDropTask}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default CardBoard;