import express from 'express';
import { authController } from './auth.controller';
import { auth } from '../../middleware/auth';



const router = express.Router()

router.post('/email', authController.registerUser)



router.get('/', auth(), authController.getCurrentUser)

export const authRouter = router