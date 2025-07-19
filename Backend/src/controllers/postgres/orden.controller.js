import Orden from '../../models/postgres/orden.model.js';

const createOrden = async (req, res) => {
    try {
        // Validaciones básicas
        const { 
            cliente,
            vehiculo,
            tecnico_id,
            servicio_id,
            descripcion_actividad,
            insumos_utilizados,
            fecha_inicio
        } = req.body;

        if (!cliente || !vehiculo || !tecnico_id || !servicio_id || !descripcion_actividad || !insumos_utilizados || !fecha_inicio) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Si es cliente no registrado, validar campos adicionales
        if (cliente.tipo === 'no_registrado' && (!cliente.nombre || !cliente.telefono)) {
            return res.status(400).json({ 
                message: 'Para clientes no registrados, nombre y teléfono son obligatorios' 
            });
        }

        const orden = await Orden.create(req.body);
        res.status(201).json(orden);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al crear orden',
            error: error.message 
        });
    }
};

const getOrdenes = async (req, res) => {
    try {
        const ordenes = await Orden.findAll();
        res.json(ordenes);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al obtener órdenes',
            error: error.message 
        });
    }
};

const getOrdenByFolio = async (req, res) => {
    try {
        const orden = await Orden.findByFolio(req.params.folio);
        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(orden);
    } catch (error) {
        // Error
        res.status(500).json({ message: error.message });
    }
};

const updateOrdenTotal = async (req, res) => {
    try {
        const orden = await Orden.updateTotal(req.params.id, req.body.total);
        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(orden);
    } catch (error) {
        // Error
        res.status(500).json({ message: error.message });
    }
};

const updateOrdenEstado = async (req, res) => {
    try {
        const orden = await Orden.updateEstado(req.params.id, req.body.estado);
        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(orden);
    } catch (error) {
        // Error
        res.status(500).json({ message: error.message });
    }
};

const deleteOrden = async (req, res) => {
    try {
      const { id } = req.params;
      await Orden.delete(id);
      res.json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const finalizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_fin } = req.body;
    
    const orden = await Orden.finalizar(id, fecha_fin);
    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    createOrden,
    getOrdenes,
    getOrdenByFolio,
    updateOrdenTotal,
    updateOrdenEstado,
    deleteOrden,
    finalizarOrden
};