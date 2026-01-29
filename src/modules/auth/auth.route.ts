import express from 'express';
import { getCurrentUser } from './auth.controller';
import { auth } from '../../middleware/auth';
import { loadUser } from '../../middleware/loadUser';
import { hitApi } from '../../middleware/hitChecker';
const router = express.Router()

router.get('/',hitApi, auth(), loadUser, getCurrentUser)

export const authRouter = router