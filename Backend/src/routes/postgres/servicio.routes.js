import express from 'express';
import { servicioController } from '../../controllers/postgres/servicio.controller.js';

const router = express.Router();

router.post('/servicios', servicioController.createServicio);
router.get('/servicios', servicioController.getServicios);
router.delete('/servicios/:id', servicioController.deleteServicio);
router.put('/servicios/:id', servicioController.updateServicio);

export default router;