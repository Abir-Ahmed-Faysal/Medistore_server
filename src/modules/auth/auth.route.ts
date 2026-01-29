import express from 'express';
import { getCurrentUser } from './auth.controller';
import { auth } from '../../middleware/auth';


const router = express.Router()

router.get('/', auth(),  getCurrentUser)

export const authRouter = router