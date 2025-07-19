import { Router } from 'express';
import { clienteController } from '../../controllers/postgres/cliente.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Rutas
router.post('/clientes', clienteController.createCliente);
router.get('/clientes', clienteController.getClientes);
router.get('/clientes/with-vehiculos', clienteController.getClientesWithVehiculos);
router.get('/clientes/:id', clienteController.getClienteById);
router.get('/clientes/:id/with-all-vehiculos', clienteController.getClienteByIdWithAllVehiculos);
router.delete('/clientes/:id', clienteController.deleteCliente);
router.get('/clientes/:id/vehiculos', clienteController.getClienteVehiculo);
router.post('/clientes/:id/vehiculos', clienteController.createVehiculo);

export default router;