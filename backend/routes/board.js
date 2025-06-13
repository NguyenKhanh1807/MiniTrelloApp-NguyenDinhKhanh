// routes/board.js
import express from 'express';
import { db } from '../firebase/admin.js';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

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

// --- BOARD ROUTES ---

router.get('/', authenticateToken, async (req, res) => {
  const boards = await db.collection('boards').where('owner', '==', req.user.email).get();
  const result = boards.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(result);
});

router.get('/:boardId', authenticateToken, async (req, res) => {
  try {
    const doc = await db.collection('boards').doc(req.params.boardId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Board not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  const newBoard = await db.collection('boards').add({
    name,
    description,
    owner: req.user.email,
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ id: newBoard.id, name, description });
});

router.put('/:boardId', authenticateToken, async (req, res) => {
  try {
    const ref = db.collection('boards').doc(req.params.boardId);
    await ref.update(req.body);
    const updated = await ref.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update board' });
  }
});

router.delete('/:boardId', authenticateToken, async (req, res) => {
  try {
    await db.collection('boards').doc(req.params.boardId).delete();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

// --- INVITES ---

router.post('/:boardId/invite', authenticateToken, async (req, res) => {
  try {
    const { email_member } = req.body;
    const inviteRef = await db.collection('boardInvites').add({
      board_id: req.params.boardId,
      email_member,
      board_owner_id: req.user.email,
      status: 'pending',
      createdAt: new Date()
    });
    res.status(200).json({ success: true, invite_id: inviteRef.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send board invitation' });
  }
});

router.get('/:boardId/invite', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('boardInvites')
      .where('board_id', '==', req.params.boardId)
      .get();
    const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(invites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get board invites' });
  }
});

router.post('/:boardId/invite/accept', authenticateToken, async (req, res) => {
  try {
    const { invite_id, status } = req.body;
    const inviteRef = db.collection('boardInvites').doc(invite_id);
    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) return res.status(404).json({ error: 'Invite not found' });

    await inviteRef.update({ status });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept invite' });
  }
});

router.get('/user/invites/all', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('boardInvites')
      .where('email_member', '==', req.user.email)
      .get();
    const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(invites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get your invites' });
  }
});

router.delete('/:boardId/invite/:email', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('boardInvites')
      .where('board_id', '==', req.params.boardId)
      .where('email_member', '==', req.params.email)
      .get();
    if (snapshot.empty) return res.status(404).json({ error: 'Invite not found' });

    await snapshot.docs[0].ref.delete();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// --- CARD INVITE ACCEPT ---

router.post('/:boardId/cards/:cardId/invite/accept', authenticateToken, async (req, res) => {
  const { invite_id, member_id, status } = req.body;
  try {
    const inviteRef = db.collection('cardInvites').doc(invite_id);
    await inviteRef.update({ status });

    if (status === 'accepted') {
      const cardRef = db.collection('boards').doc(req.params.boardId).collection('cards').doc(req.params.cardId);
      await cardRef.update({
        members: admin.firestore.FieldValue.arrayUnion(member_id)
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to invitation' });
  }
});

// --- USER PROFILE ---

router.get('/users/me', authenticateToken, async (req, res) => {
  try {
    const userSnap = await db.collection('users').doc(req.user.email).get();
    if (!userSnap.exists) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ id: userSnap.id, ...userSnap.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

router.put('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (req.user.email !== id) return res.status(403).json({ error: 'Permission denied' });

  try {
    const userRef = db.collection('users').doc(id);
    await userRef.update(req.body);
    const updated = await userRef.get();
    res.status(200).json({ id: updated.id, ...updated.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user info' });
  }
});

export default router;