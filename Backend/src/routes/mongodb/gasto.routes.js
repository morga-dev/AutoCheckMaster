import express from 'express';
import { createGasto, getGastos, deleteGasto } from '../../controllers/mongodb/gasto.controller.js';

const router = express.Router();

router.post('/gastos', createGasto);
router.get('/gastos', getGastos);
router.delete('/gastos/:id', deleteGasto);

export default router;