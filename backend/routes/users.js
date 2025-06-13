import express from 'express';
import { db } from '../firebase/admin.js';
import jwt from 'jsonwebtoken';
import { requireSelfOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userSnap = await db.collection('users').doc(req.user.email).get();
    if (!userSnap.exists) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ id: userSnap.id, ...userSnap.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

router.put('/me', authenticateToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.email);
    await userRef.update(req.body);
    const updated = await userRef.get();
    res.status(200).json({ id: updated.id, ...updated.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user info' });
  }
});

router.put('/:email', authenticateToken, requireSelfOrAdmin('email'), async (req, res) => {
  const { email } = req.params;
  const isSelf = email === req.user.email;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  try {
    const ref = db.collection('users').doc(email);
    await ref.update(req.body);
    const updated = await ref.get();
    res.status(200).json({ id: updated.id, ...updated.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user info' });
  }
});

export default router;