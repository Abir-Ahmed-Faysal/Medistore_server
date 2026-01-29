import express from 'express';
import { auth } from '../../middleware/auth';
import { userController } from './user.controller';
const router = express.Router()


router.get('/', auth("ADMIN" ), userController.getAllUser)

router.get('/:id', auth("ADMIN"), userController.getUser)


export const userRouter = router