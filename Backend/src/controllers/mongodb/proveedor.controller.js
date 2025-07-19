import Proveedor from '../../models/mongodb/proveedor.model.js';

const createProveedor = async (req, res) => {
    try {
        const proveedor = new Proveedor({
            ...req.body,
            historialCompras: [{
                fechaCompra: req.body.fechaCompra,
                productoServicio: req.body.productoServicio,
                cantidad: req.body.cantidad,
                costoTotal: req.body.costoTotal
            }]
        });
        await proveedor.save();
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find().sort({ nombreEmpresa: 1 });
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleEstatus = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        proveedor.estatus = proveedor.estatus === 'Activo' ? 'Inactivo' : 'Activo';
        await proveedor.save();
        
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createProveedor, getProveedores, deleteProveedor, toggleEstatus };