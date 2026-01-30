import express from 'express';
import { medicineController } from './medicine.controller';
import { auth } from '../../middleware/auth';
import { hitApi } from '../../middleware/hitChecker';

const router = express.Router();

//user
router.get('/', medicineController.getAllMedicines);
router.get('/:id',hitApi, medicineController.getMedicine);


//*seller */
router.post('/', auth("SELLER"), medicineController.addMedicine);
router.patch('/:id', auth("SELLER"), medicineController.updateMedicine);
router.delete('/:id', auth("SELLER"), medicineController.removeMedicine);

// {"title":"Napa Extra 500mg",
// "description":"napa is a pain reliever, fever reducer, and anti-inflammatory medication used to treat mild to moderate pain and reduce fever.",
// "manufacturer":"Square Pharmaceuticals Ltd.",
// "price":5,
// "stock":"500",
// "categoryId":"6e5ea054-c3c6-4b1e-8795-6ab6b58a85d0"}




export { router as medicineRouter };