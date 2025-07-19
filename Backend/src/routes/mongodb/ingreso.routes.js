import express from 'express';
import { createIngreso, getIngresos, deleteIngreso, updateEstado} from '../../controllers/mongodb/ingreso.controller.js';

const router = express.Router();

router.post('/ingresos', createIngreso);
router.get('/ingresos', getIngresos);
router.delete('/ingresos/:id', deleteIngreso);
router.patch('/ingresos/:id/estado', updateEstado);

export default router;