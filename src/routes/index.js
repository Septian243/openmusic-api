import { Router } from 'express';
import albums from '../services/albums/routes/index.js';
import songs from '../services/songs/routes/index.js';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';
import playlists from '../services/playlists/routes/index.js';
import collaborations from '../services/collaborations/routes/index.js';
import activities from '../services/activities/routes/index.js';
import likes from '../services/likes/routes/index.js';
import uploads from '../services/uploads/routes/index.js';
import exports from '../services/exports/routes/index.js';

const router = Router();

router.use('/', albums);
router.use('/', songs);
router.use('/', users);
router.use('/', authentications);
router.use('/', playlists);
router.use('/', collaborations);
router.use('/', activities);
router.use('/', likes);
router.use('/', uploads);
router.use('/', exports);

export default router;