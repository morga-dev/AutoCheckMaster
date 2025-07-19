import express from 'express';
import { createProveedor, getProveedores, deleteProveedor, toggleEstatus } from '../../controllers/mongodb/proveedor.controller.js';

const router = express.Router();

router.post('/proveedores', createProveedor);
router.get('/proveedores', getProveedores);
router.delete('/proveedores/:id', deleteProveedor);
router.patch('/proveedores/:id/toggle-estatus', toggleEstatus);

export default router;