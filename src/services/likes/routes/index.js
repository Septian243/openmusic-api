import express from 'express';
import { likeAlbum, unLikeAlbum, getAlbumLikes } from '../controller/like-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/album/:id/likes', authenticateToken, likeAlbum);
router.delete('/album/:id/likes', authenticateToken, unLikeAlbum);
router.get('/album/:id/likes', getAlbumLikes);

export default router;