import express from 'express';
import { medicineController } from './medicine.controller';
import { auth } from '../../middleware/auth';

const router = express.Router();

//user
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getAllMedicines);


//*seller */
router.post('/', auth("SELLER"), medicineController.addMedicine);
router.patch('/:id', auth("SELLER"), medicineController.updateMedicine);
router.delete('/:id', auth("SELLER"), medicineController.removeMedicine);

{"title":"",
"description":"",
"manufacturer":"",
"price":"",
"stock":"",
"sellerId":"",
"categoryId":""}




export { router as medicineRouter };