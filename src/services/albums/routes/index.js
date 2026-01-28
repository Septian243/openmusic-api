import express from 'express';
import { addAlbum, getAlbumById, editAlbumById, deleteAlbumById } from '../controller/album-controller.js';
import validate from '../../../middlewares/validate.js';
import { albumPlayloadSchema } from '../validator/schema.js';

const router = express.Router();

router.post('/albums', validate(albumPlayloadSchema), addAlbum);
router.get('/albums/:id', getAlbumById);
router.put('/albums/:id', validate(albumPlayloadSchema), editAlbumById);
router.delete('/albums/:id', deleteAlbumById);

export default router;