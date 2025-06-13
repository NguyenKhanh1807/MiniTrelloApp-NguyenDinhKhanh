import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import CardController from '../controllers/cardController.js';

const router = express.Router({ mergeParams: true });

router.get('/', verifyToken, CardController.getCards);
router.post('/', verifyToken, CardController.createCard);
router.get('/:cardId', verifyToken, CardController.getCard);
router.put('/:cardId', verifyToken, CardController.updateCard);
router.delete('/:cardId', verifyToken, CardController.deleteCard);

router.post('/:cardId/invite', verifyToken, CardController.inviteMember);
router.get('/:cardId/invite', verifyToken, CardController.getInvitedMembers);
router.delete('/:cardId/invite/:email', verifyToken, CardController.removeMember);

export default router;