import express from 'express';
import { auth } from '../../middleware/auth';
import { userController } from './user.controller';
const router = express.Router()


router.get('/', auth("ADMIN"), userController.getAllUser)

router.patch('/update-user',  auth("USER",), userController.updateUser)
router.patch('/:id/ban', auth("ADMIN"), userController.banUser)
router.patch('/:id/unban', auth("ADMIN"), userController.unBanUser)


export const userRouter = router