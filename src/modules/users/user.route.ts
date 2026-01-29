import express from 'express';
import { auth } from '../../middleware/auth';
import { userController } from './user.controller';
const router = express.Router()


router.get('/', auth('ADMIN','USER'), userController.getAllUser)


export const userRouter= router