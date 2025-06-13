import { db } from '../firebase/admin.js';

const TaskController = {
  async getTasks(req, res) {
    try {
      const { boardId, cardId } = req.params;
      const snapshot = await db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .get();

      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get tasks' });
    }
  },

  async getTask(req, res) {
    try {
      const { boardId, cardId, taskId } = req.params;
      const taskSnap = await db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .doc(taskId)
        .get();

      if (!taskSnap.exists) return res.status(404).json({ error: 'Task not found' });
      res.json({ id: taskSnap.id, ...taskSnap.data() });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get task' });
    }
  },

  async createTask(req, res) {
    try {
      const { boardId, cardId } = req.params;
      const { title, description, status = 'icebox' } = req.body;

      const taskRef = await db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .add({
          title,
          description,
          status,
          assignees: [],
          createdAt: new Date(),
        });

      const task = await taskRef.get();
      res.status(201).json({ id: task.id, ...task.data() });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  async updateTask(req, res) {
    try {
      const { boardId, cardId, taskId } = req.params;
      const updates = req.body;

      const taskRef = db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .doc(taskId);

      await taskRef.update(updates);
      const updated = await taskRef.get();
      res.json({ id: updated.id, ...updated.data() });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  async deleteTask(req, res) {
    try {
      const { boardId, cardId, taskId } = req.params;
      await db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .doc(taskId)
        .delete();

      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  async assignMember(req, res) {
    try {
      const { boardId, cardId, taskId } = req.params;
      const { memberId } = req.body;

      const taskRef = db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .doc(taskId);

      const taskSnap = await taskRef.get();
      if (!taskSnap.exists) return res.status(404).json({ error: 'Task not found' });

      const task = taskSnap.data();
      const updatedAssignees = [...new Set([...(task.assignees || []), memberId])];

      await taskRef.update({ assignees: updatedAssignees });
      res.json({ id: taskId, ...task, assignees: updatedAssignees });
    } catch (err) {
      res.status(500).json({ error: 'Failed to assign member' });
    }
  },

  async getAssignedMembers(req, res) {
    try {
      const { boardId, cardId, taskId } = req.params;
      const taskSnap = await db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .doc(taskId)
        .get();

      if (!taskSnap.exists) return res.status(404).json({ error: 'Task not found' });
      const { assignees = [] } = taskSnap.data();
      res.json(assignees);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get assignees' });
    }
  },

  async removeMemberAssignment(req, res) {
    try {
      const { boardId, cardId, taskId, memberId } = req.params;

      const taskRef = db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId)
        .collection('tasks')
        .doc(taskId);

      const taskSnap = await taskRef.get();
      if (!taskSnap.exists) return res.status(404).json({ error: 'Task not found' });

      const task = taskSnap.data();
      const updatedAssignees = (task.assignees || []).filter(id => id !== memberId);

      await taskRef.update({ assignees: updatedAssignees });
      res.json({ id: taskId, ...task, assignees: updatedAssignees });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove assignee' });
    }
  }
};

export default TaskController;
