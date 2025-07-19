import express from 'express';
import { createRefaccion, getRefacciones, deleteRefaccion } from '../../controllers/mongodb/refaccion.controller.js';

const router = express.Router();

router.post('/refacciones', createRefaccion);
router.get('/refacciones', getRefacciones);
router.delete('/refacciones/:id', deleteRefaccion);

export default router;