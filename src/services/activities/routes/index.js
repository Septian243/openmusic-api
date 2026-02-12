import express from 'express';
import { getPlaylistActivities } from '../controller/activity-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = express.Router();

router.get('/playlists/:id/activities', authenticateToken, getPlaylistActivities);

export default router;