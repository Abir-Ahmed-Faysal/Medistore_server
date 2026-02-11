import express from 'express';
import { auth } from '../../middleware/auth';
import { userController } from './user.controller';
import { hitApi } from '../../middleware/hitChecker';
const router = express.Router()


router.get('/', auth("ADMIN"), userController.getAllUser)

router.patch('/update-user', hitApi, auth("USER",), userController.updateUser)
router.patch('/:id/ban', auth("ADMIN"), userController.banUser)
router.patch('/:id/unban', auth("ADMIN"), userController.unBanUser)


export const userRouter = router