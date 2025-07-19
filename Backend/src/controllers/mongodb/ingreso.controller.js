import Ingreso from '../../models/mongodb/ingreso.model.js';

const createIngreso = async (req, res) => {
    try {
        const { _id, ...ingresoData } = req.body;
        
        const ingreso = new Ingreso(ingresoData);
        await ingreso.save();
        
        res.status(201).json(ingreso);
    } catch (error) {
        //Error
        res.status(500).json({ 
            message: 'Error al crear ingreso',
            error: error.message 
        });
    }
};

const getIngresos = async (req, res) => {
    try {
        const ingresos = await Ingreso.find().sort({ fecha: -1 });
        res.json(ingresos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteIngreso = async (req, res) => {
    try {
        const ingreso = await Ingreso.findByIdAndDelete(req.params.id);
        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }
        res.json({ message: 'Ingreso eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEstado = async (req, res) => {
    try {
        const ingreso = await Ingreso.findByIdAndUpdate(
            req.params.id,
            { estado: 'Pagado' },
            { new: true }
        );
        
        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }
        
        res.json(ingreso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createIngreso, getIngresos, deleteIngreso, updateEstado };