import express from 'express';
import { refreshToken, login, logout } from '../controller/authentication-controller.js';
import validate from '../../../middlewares/validate.js';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema
}
  from '../validator/schema.js';

const router = express.Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/authentications', validate(deleteAuthenticationPayloadSchema), logout);

export default router;