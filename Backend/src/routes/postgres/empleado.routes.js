import express from 'express';
import { empleadoController } from '../../controllers/postgres/empleado.controller.js';

const router = express.Router();

router.post('/empleados', empleadoController.createEmpleado);
router.get('/empleados', empleadoController.getEmpleados);
router.delete('/empleados/:id', empleadoController.deleteEmpleado);
router.get('/especialidades', empleadoController.getEspecialidades);

export default router;