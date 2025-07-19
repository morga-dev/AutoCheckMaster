import Gasto from '../../models/mongodb/gasto.model.js';

const createGasto = async (req, res) => {
    try {
        const gasto = new Gasto(req.body);
        await gasto.save();
        res.status(201).json(gasto);
    } catch (error) {
        // Eror
        res.status(500).json({ message: error.message });
    }
};

const getGastos = async (req, res) => {
    try {
        const gastos = await Gasto.find().sort({ fecha: -1 });
        res.json(gastos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGasto = async (req, res) => {
    try {
        const gasto = await Gasto.findByIdAndDelete(req.params.id);
        if (!gasto) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }
        res.json({ message: 'Gasto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Corregido aquí
    }
};

export { createGasto, getGastos, deleteGasto };