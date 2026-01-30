import express from 'express';
import { categoryController } from './category.controller';
import { auth } from '../../middleware/auth';

const router = express.Router();

// *public routes *//
router.get('/', categoryController.getAllCategory);

// *protected routes - admin only *//
router.post('/', auth("ADMIN"), categoryController.createCategory);
router.patch('/:id', auth("ADMIN"), categoryController.updateCategory);
router.delete('/:id', auth("ADMIN"), categoryController.deleteCategory);

// category_name



export { router as categoryRouter };