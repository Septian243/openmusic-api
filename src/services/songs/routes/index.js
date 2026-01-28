import express from 'express';
import { addSong, getAllSongs, getSongById, editSongById, deleteSongById } from '../controller/song-controller.js';
import validate from '../../../middlewares/validate.js';
import { songPlayloadSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/songs', validate(songPlayloadSchema), addSong);
router.get('/songs', getAllSongs);
router.get('/songs/:id', getSongById);
router.put('/songs/:id', validate(songPlayloadSchema), editSongById);
router.delete('/songs/:id', deleteSongById);

export default router;