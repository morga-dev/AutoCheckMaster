import express from 'express';
import { historialController } from '../../controllers/postgres/historial.controller.js';
import { validatePdfFile } from '../../middleware/file.middleware.js';

const router = express.Router();

// Rutas para gestión de la tabla
router.post('/create-table', historialController.createTable);
router.post('/recreate-table', historialController.recreateTable);
router.get('/test-table', historialController.testTable);

// Rutas CRUD

// Ruta para crear servicios (con validación de PDF)
router.post('/historial/servicio', validatePdfFile, historialController.createServicio);

// Obtener todo el historial
router.get('/historial', historialController.getAll);

// Eliminar un servicio
router.delete('/historial/servicio/:id', historialController.deleteServicio);

// Eliminar un cliente del historial
router.delete('/historial/cliente/:id', historialController.deleteCliente);

// Eliminar un vehículo del historial
router.delete('/historial/vehiculo/:id', historialController.deleteVehiculo);

export default router;