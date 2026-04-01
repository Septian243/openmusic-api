import express from 'express';
import { uploadAlbumCover } from '../controller/upload-controller.js';
import upload from '../../../middlewares/upload.js';

const router = express.Router();

router.post('/albums/:id/covers', upload.single('cover'), uploadAlbumCover);

export default router;