import Cliente from '../../models/postgres/cliente.model.js';

const createCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear cliente',
            error: error.message 
        });
    }
};

const getClientes = async (req, res) => {
    try {
        const result = await Cliente.findAll();
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener clientes',
            error: error.message 
        });
    }
};

const getClientesWithVehiculos = async (req, res) => {
    try {
        const result = await Cliente.findAllWithVehiculos();
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener clientes con vehículos',
            error: error.message 
        });
    }
};

const getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener cliente',
            error: error.message 
        });
    }
};

const getClienteByIdWithAllVehiculos = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdWithAllVehiculos(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener cliente con vehículos',
            error: error.message 
        });
    }
};

const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Cliente.delete(id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar cliente',
            error: error.message 
        });
    }
};

const getClientesCount = async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM clientes');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClienteVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculos = await Cliente.findVehiculos(id);
        
        if (!vehiculos) {
            return res.status(404).json({ 
                message: 'No se encontraron vehículos para este cliente' 
            });
        }

        res.json(vehiculos);
    } catch (error) {
        console.error('Error al obtener vehículos del cliente:', error);
        res.status(500).json({ 
            message: 'Error al obtener vehículos',
            error: error.message 
        });
    }
};

const createVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await Cliente.createVehiculo(id, req.body);
        res.status(201).json({
            message: 'Vehículo creado exitosamente',
            data: vehiculo
        });
    } catch (error) {
        console.error('Error al crear vehículo:', error);
        res.status(500).json({ 
            message: 'Error al crear vehículo',
            error: error.message 
        });
    }
};

// Exportar todo en un solo objeto
export const clienteController = {
    createCliente,
    getClientes,
    getClientesWithVehiculos,
    getClienteById,
    getClienteByIdWithAllVehiculos,
    deleteCliente,
    getClientesCount,
    getClienteVehiculo,
    createVehiculo
};