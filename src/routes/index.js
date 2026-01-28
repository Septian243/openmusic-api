import { Router } from 'express';
import albums from '../services/albums/routes/index.js';
import songs from '../services/songs/routes/index.js';

const router = Router();

router.use('/', albums);
router.use('/', songs);

export default router;