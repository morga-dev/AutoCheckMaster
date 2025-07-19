import { Router } from 'express';
import {
    createOrden,
    getOrdenes,
    getOrdenByFolio,
    updateOrdenTotal,
    updateOrdenEstado,
    deleteOrden,
    finalizarOrden
} from '../../controllers/postgres/orden.controller.js';

const router = Router();

router.post('/ordenes', createOrden);
router.get('/ordenes', getOrdenes);
router.get('/ordenes/folio/:folio', getOrdenByFolio);
router.patch('/ordenes/:id/total', updateOrdenTotal);
router.patch('/ordenes/:id/estado', updateOrdenEstado);
router.patch('/ordenes/:id/finalizar', finalizarOrden);
router.delete('/ordenes/:id', deleteOrden);

export default router;