// routes/tasks.js
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import TaskController from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.get('/', verifyToken, TaskController.getTasks);
router.post('/', verifyToken, TaskController.createTask);

router.get('/:taskId', verifyToken, TaskController.getTask);
router.put('/:taskId', verifyToken, TaskController.updateTask);
router.delete('/:taskId', verifyToken, TaskController.deleteTask);

router.post('/:taskId/assign', verifyToken, TaskController.assignMember);
router.get('/:taskId/assign', verifyToken, TaskController.getAssignedMembers);
router.delete('/:taskId/assign/:memberId', verifyToken, TaskController.removeMemberAssignment);

export default router;