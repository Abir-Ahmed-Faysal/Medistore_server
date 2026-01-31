import express from 'express';
import { authController } from './auth.controller';
import { auth } from '../../middleware/auth';
import { hitApi } from '../../middleware/hitChecker';


const router = express.Router()

router.post('/email',hitApi, authController.registerUser)



router.get('/', auth(), authController.getCurrentUser)

export const authRouter = router