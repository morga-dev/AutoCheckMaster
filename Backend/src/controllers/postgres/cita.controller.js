import Cita from '../../models/postgres/cita.model.js';

// Mapa de transiciones permitidas entre estados
const transicionesValidas = {
  Pendiente:  ['Confirmada'],
  Confirmada: ['Completada', 'Cancelada'],
  Completada: [],
  Cancelada:  []
};

const createCita = async (req, res) => {
    try {
        const {
            cliente,
            vehiculo,
            servicio_id,
            descripcion,
            fecha,
            hora,
            tecnico_id,
            comentarios
        } = req.body;

        // Validaciones básicas
        if (!cliente || !vehiculo || !servicio_id || !fecha || !hora || !tecnico_id) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Validar datos de contacto
        if (!cliente.correo || !cliente.telefono) {
            return res.status(400).json({ 
                message: 'El correo y teléfono son obligatorios'
            });
        }

        const cita = await Cita.create(req.body);
        res.status(201).json(cita);
    } catch (error) {
        // Error interno
        res.status(500).json({ message: error.message });
    }
};

const getCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Si se está actualizando el estado, validar transiciones
        if (req.body.estado) {
            // Validar estado reconocido
            const estadosReconocidos = Object.keys(transicionesValidas);
            if (!estadosReconocidos.includes(req.body.estado)) {
                return res.status(400).json({ message: 'Estado no válido' });
            }

            // Obtener cita actual
            const citaActual = await Cita.findById(id);
            if (!citaActual) {
                return res.status(404).json({ message: 'Cita no encontrada' });
            }

            const estadoActual = citaActual.estado;
            const nuevoEstado = req.body.estado;

            // Validar transición permitida
            if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
                return res.status(400).json({
                    message: `No está permitida la transición de "${estadoActual}" a "${nuevoEstado}".`
                });
            }
        }

        const cita = await Cita.update(id, req.body);
        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        res.json(cita);
    } catch (error) {
        console.error('Error en updateCita:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateCitaEstado = async (req, res) => {
    const { id } = req.params;
    const { estado: nuevoEstado } = req.body;

    // Validar estado reconocido
    const estadosReconocidos = Object.keys(transicionesValidas);
    if (!estadosReconocidos.includes(nuevoEstado)) {
        return res.status(400).json({ message: 'Estado no válido' });
    }

    try {
        // 1. Obtener cita actual
        const citaActual = await Cita.findById(id);
        if (!citaActual) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const estadoActual = citaActual.estado;

        // 2. Validar transición permitida
        if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
            return res.status(400).json({
                message: `No está permitida la transición de "${estadoActual}" a "${nuevoEstado}".`
            });
        }

        // 3. Actualizar estado
        const citaActualizada = await Cita.updateEstado(id, nuevoEstado);
        res.json(citaActualizada);
    } catch (error) {
        console.error('Error en updateCitaEstado:', error);
        res.status(500).json({ message: 'Error interno al actualizar estado' });
    }
};

const deleteCita = async (req, res) => {
    try {
        await Cita.delete(req.params.id);
        res.json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createCita,
    getCitas,
    updateCita,
    updateCitaEstado,
    deleteCita
};