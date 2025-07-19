import { Router } from 'express';
import {
    createCita,
    getCitas,
    updateCita,
    updateCitaEstado,
    deleteCita
} from '../../controllers/postgres/cita.controller.js';

const router = Router();

router.post('/citas', createCita);
router.get('/citas', getCitas);
router.put('/citas/:id', updateCita);
router.patch('/citas/:id/estado', updateCitaEstado);
router.delete('/citas/:id', deleteCita);

export default router;