import { Router } from 'express';
import { getEmpresa, updateEmpresa } from '../../controllers/mongodb/empresa.controller.js';

const router = Router();

router.get('/empresa', getEmpresa);
router.put('/empresa', updateEmpresa);

export default router;