import Empresa from '../../models/mongodb/empresa.model.js';

export const updateEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne();
        
        if (empresa) {
            const updatedEmpresa = await Empresa.findByIdAndUpdate(
                empresa._id,
                req.body,
                { new: true }
            );
            res.json(updatedEmpresa);
        } else {
            const newEmpresa = new Empresa(req.body);
            const savedEmpresa = await newEmpresa.save();
            res.status(201).json(savedEmpresa);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne();
        res.json(empresa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};