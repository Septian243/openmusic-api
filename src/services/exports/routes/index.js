import express from 'express';
import { exportPlaylist } from '../controller/export-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/export/playlists/:playlistId', authenticateToken, exportPlaylist);

export default router;