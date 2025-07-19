import Servicio from '../../models/postgres/servicio.model.js';

const getServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al obtener servicios',
            error: error.message 
        });
    }
};

const createServicio = async (req, res) => {
    try {
        const servicio = await Servicio.create(req.body);
        res.status(201).json(servicio);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al crear servicio',
            error: error.message 
        });
    }
};

const deleteServicio = async (req, res) => {
    try {
        await Servicio.delete(req.params.id);
        res.json({ message: 'Servicio eliminado exitosamente' });
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al eliminar servicio',
            error: error.message 
        });
    }
};

const updateServicio = async (req, res) => {
    try {
        const servicio = await Servicio.update(req.params.id, req.body);
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        res.json(servicio);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al actualizar servicio',
            error: error.message 
        });
    }
};

export const servicioController = {
    getServicios,
    createServicio,
    deleteServicio,
    updateServicio
};