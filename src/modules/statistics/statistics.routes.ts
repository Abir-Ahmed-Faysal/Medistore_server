import express from 'express';
import { statisticsController } from './statistics.controller';
import { auth } from '../../middleware/auth';
const router = express.Router()





router.get('/admin', auth("ADMIN"), statisticsController.adminStatistics)


router.get('/seller', auth("SELLER"), statisticsController.SellerStatistics)



export const staticsRouter = router