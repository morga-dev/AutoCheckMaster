import express from 'express';
import { getPerfil, updatePerfil } from '../../controllers/mongodb/perfil.controller.js';

const router = express.Router();

router.get('/perfil', getPerfil);
router.put('/perfil', updatePerfil);

export default router;