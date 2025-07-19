import Refaccion from '../../models/mongodb/refaccion.model.js';

const createRefaccion = async (req, res) => {
    try {
        const refaccion = new Refaccion(req.body);
        await refaccion.save();
        res.status(201).json(refaccion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRefacciones = async (req, res) => {
    try {
        const refacciones = await Refaccion.find().sort({ nombre: 1 });
        res.json(refacciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRefaccion = async (req, res) => {
    try {
        const refaccion = await Refaccion.findByIdAndDelete(req.params.id);
        if (!refaccion) {
            return res.status(404).json({ message: 'Refacción no encontrada' });
        }
        res.json({ message: 'Refacción eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createRefaccion, getRefacciones, deleteRefaccion };