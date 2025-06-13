import { db } from '../firebase/admin.js';

const CardController = {
  async getCards(req, res) {
    try {
      const { boardId } = req.params;
      const snapshot = await db.collection('boards').doc(boardId).collection('cards').get();

      const cards = await Promise.all(snapshot.docs.map(async (doc) => {
        const taskSnap = await db
          .collection('boards')
          .doc(boardId)
          .collection('cards')
          .doc(doc.id)
          .collection('tasks')
          .get();

        return {
          id: doc.id,
          ...doc.data(),
          tasks_count: taskSnap.size || 0,
        };
      }));

      res.json(cards);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get cards' });
    }
  },

  async createCard(req, res) {
    try {
      const { boardId } = req.params;
      const { name, description } = req.body;

      const newCardRef = await db.collection('boards').doc(boardId).collection('cards').add({
        name,
        description,
        createdAt: new Date(),
        list_member: []
      });

      const cardDoc = await newCardRef.get();
      res.status(201).json({ id: cardDoc.id, ...cardDoc.data() });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create card' });
    }
  },

  async getCard(req, res) {
    try {
      const { boardId, cardId } = req.params;
      const cardDoc = await db.collection('boards').doc(boardId).collection('cards').doc(cardId).get();

      if (!cardDoc.exists) return res.status(404).json({ error: 'Card not found' });

      res.json({ id: cardDoc.id, ...cardDoc.data() });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get card' });
    }
  },

  async updateCard(req, res) {
    try {
      const { boardId, cardId } = req.params;
      const updates = req.body;

      const cardRef = db
        .collection('boards')
        .doc(boardId)
        .collection('cards')
        .doc(cardId);

      await cardRef.update(updates);
      const updated = await cardRef.get();

      res.json({ id: updated.id, ...updated.data() });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update card' });
    }
  },

  async deleteCard(req, res) {
    try {
      const { boardId, cardId } = req.params;
      await db.collection('boards').doc(boardId).collection('cards').doc(cardId).delete();
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete card' });
    }
  },

  async inviteMember(req, res) {
    try {
      const { boardId, cardId } = req.params;
      const { email } = req.body;

      const cardRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId);
      const doc = await cardRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Card not found' });

      const currentMembers = doc.data().list_member || [];
      if (currentMembers.includes(email)) {
        return res.status(409).json({ error: 'Member already invited' });
      }

      const updatedMembers = [...currentMembers, email];
      await cardRef.update({ list_member: updatedMembers });

      res.status(200).json({ id: cardId, list_member: updatedMembers });
    } catch (err) {
      res.status(500).json({ error: 'Failed to invite member' });
    }
  },

  async getInvitedMembers(req, res) {
    try {
      const { boardId, cardId } = req.params;
      const doc = await db.collection('boards').doc(boardId).collection('cards').doc(cardId).get();
      if (!doc.exists) return res.status(404).json({ error: 'Card not found' });

      const { list_member = [] } = doc.data();
      res.status(200).json(list_member);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch invited members' });
    }
  },

  async removeMember(req, res) {
    try {
      const { boardId, cardId, email } = req.params;

      const cardRef = db.collection('boards').doc(boardId).collection('cards').doc(cardId);
      const doc = await cardRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Card not found' });

      const currentMembers = doc.data().list_member || [];
      const updatedMembers = currentMembers.filter(member => member !== email);

      await cardRef.update({ list_member: updatedMembers });

      res.status(200).json({ id: cardId, list_member: updatedMembers });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove member' });
    }
  }
};

export default CardController;