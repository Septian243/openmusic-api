import express from 'express';
import { addCollaboration, deleteCollaboration } from '../controller/collaboration-controller.js';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { collaborationPayloadSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/collaborations', authenticateToken, validate(collaborationPayloadSchema), addCollaboration);
router.delete('/collaborations', authenticateToken, validate(collaborationPayloadSchema), deleteCollaboration);

export default router;