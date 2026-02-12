import express from 'express';
import {
  addPlaylist,
  getPlaylists,
  deletePlaylistById,
  addSongToPlaylist,
  getPlaylistSongs,
  deleteSongFromPlaylist
} from '../controller/playlist-controller.js';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { playlistPayloadSchema, playlistSongPayloadSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/playlists', authenticateToken, validate(playlistPayloadSchema), addPlaylist);
router.get('/playlists', authenticateToken, getPlaylists);
router.delete('/playlists/:id', authenticateToken, deletePlaylistById);

router.post('/playlists/:id/songs', authenticateToken, validate(playlistSongPayloadSchema), addSongToPlaylist);
router.get('/playlists/:id/songs', authenticateToken, getPlaylistSongs);
router.delete('/playlists/:id/songs', authenticateToken, validate(playlistSongPayloadSchema), deleteSongFromPlaylist);

export default router;