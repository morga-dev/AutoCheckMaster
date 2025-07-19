import Historial from '../../models/postgres/historial.model.js';
import { unlink } from 'fs/promises';
import path from 'path';

export const historialController = {
    // Método para crear la tabla si no existe
    createTable: async (req, res) => {
        try {
            await Historial.createTableIfNotExists();
            res.json({ message: 'Tabla historial_servicios creada o verificada correctamente' });
        } catch (error) {
            console.error('Error al crear la tabla:', error);
            res.status(500).json({
                message: 'Error al crear la tabla',
                error: error.message
            });
        }
    },

    // Método para recrear la tabla con la nueva estructura
    recreateTable: async (req, res) => {
        try {
            await Historial.recreateTable();
            res.json({ message: 'Tabla historial_servicios recreada correctamente' });
        } catch (error) {
            console.error('Error al recrear la tabla:', error);
            res.status(500).json({
                message: 'Error al recrear la tabla',
                error: error.message
            });
        }
    },

    // Método de prueba para verificar la tabla
    testTable: async (req, res) => {
        try {
            const result = await Historial.testTable();
            res.json(result);
        } catch (error) {
            console.error('Error en testTable:', error);
            res.status(500).json({
                message: 'Error al verificar la tabla',
                error: error.message
            });
        }
    },

    // Crear un servicio en el historial
    createServicio: async (req, res) => {
        try {
            if (!req.files || !req.files.pdf_orden) {
                return res.status(400).json({
                    message: 'El PDF de la orden es obligatorio',
                    error: 'PDF_REQUIRED'
                });
            }

            const servicioData = {
                ...req.body,
                pdf_orden: req.pdfPath
            };

            const servicio = await Historial.createServicio(servicioData);
            
            res.status(201).json({
                message: 'Servicio creado exitosamente',
                data: servicio
            });
        } catch (error) {
            console.error('Error en createServicio:', error);
            res.status(500).json({ 
                message: 'Error al crear servicio en historial',
                error: error.message 
            });
        }
    },

    // Obtener todo el historial
    getAll: async (req, res) => {
        try {
            const historial = await Historial.findAll();
            res.json(historial);
        } catch (error) {
            console.error('Error en getAll controller:', error);
            res.status(500).json({
                message: 'Error al obtener el historial',
                error: error.message
            });
        }
    },

    // Eliminar un servicio
    deleteServicio: async (req, res) => {
        try {
            const { id } = req.params;
            const servicio = await Historial.deleteServicio(id);
            
            // Si hay un PDF asociado, eliminarlo
            if (servicio && servicio.pdf_orden) {
                try {
                    await unlink(path.join(process.cwd(), servicio.pdf_orden));
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo PDF:', unlinkError);
                }
            }
            
            res.json({ message: 'Servicio eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar servicio',
                error: error.message 
            });
        }
    },

    // Eliminar un cliente del historial
    deleteCliente: async (req, res) => {
        try {
            const { id } = req.params;
            const { tipo_cliente } = req.body;
            
            if (!tipo_cliente) {
                return res.status(400).json({
                    message: 'Tipo de cliente es requerido'
                });
            }

            const servicios = await Historial.deleteCliente(id, tipo_cliente);
            
            // Eliminar PDFs asociados
            for (const servicio of servicios) {
                if (servicio.pdf_orden) {
                    try {
                        await unlink(path.join(process.cwd(), servicio.pdf_orden));
                    } catch (unlinkError) {
                        console.error('Error al eliminar archivo PDF:', unlinkError);
                    }
                }
            }
            
            res.json({ message: 'Cliente eliminado del historial correctamente' });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar cliente del historial',
                error: error.message 
            });
        }
    },

    // Eliminar un vehículo del historial
    deleteVehiculo: async (req, res) => {
        try {
            const { id } = req.params;
            const servicios = await Historial.deleteVehiculo(id);
            
            // Eliminar PDFs asociados
            for (const servicio of servicios) {
                if (servicio.pdf_orden) {
                    try {
                        await unlink(path.join(process.cwd(), servicio.pdf_orden));
                    } catch (unlinkError) {
                        console.error('Error al eliminar archivo PDF:', unlinkError);
                    }
                }
            }
            
            res.json({ message: 'Vehículo eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar vehículo',
                error: error.message 
            });
        }
    }
};