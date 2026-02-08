import express from 'express';
import { statisticsController } from './statistics.controller';
import { auth } from '../../middleware/auth';
import { hitApi } from '../../middleware/hitChecker';
const router = express.Router()





router.get('/admin', auth("ADMIN"), statisticsController.adminStatistics)


router.get('/seller',hitApi, auth("SELLER"), statisticsController.SellerStatistics)



export const staticsRouter = router