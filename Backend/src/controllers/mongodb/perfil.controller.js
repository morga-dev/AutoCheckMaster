import Perfil from '../../models/mongodb/perfil.model.js';

export const getPerfil = async (req, res) => {
    try {
        const perfil = await Perfil.findOne();
        if (!perfil) {
            return res.status(404).json({ message: 'No se encontró el perfil' });
        }
        res.json(perfil);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePerfil = async (req, res) => {
    try {
        const perfil = await Perfil.findOne();
        
        if (perfil) {
            const updatedPerfil = await Perfil.findByIdAndUpdate(
                perfil._id,
                req.body,
                { new: true, runValidators: true }
            );
            res.json(updatedPerfil);
        } else {
            const newPerfil = new Perfil(req.body);
            const savedPerfil = await newPerfil.save();
            res.status(201).json(savedPerfil);
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Error de validación: ' + error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};