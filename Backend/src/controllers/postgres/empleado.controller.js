import Empleado from '../../models/postgres/empleado.model.js';

const createEmpleado = async (req, res) => {
    try {
        const {
            nombre, apellido, fecha_nacimiento, edad,
            curp, rfc, domicilio, telefono_casa,
            celular, email, anos_experiencia,
            contacto_nombre, contacto_parentesco, contacto_telefono,
            especialidades
        } = req.body;

        // Validaciones más detalladas
        if (!nombre?.trim()) return res.status(400).json({ message: 'El nombre es requerido' });
        if (!apellido?.trim()) return res.status(400).json({ message: 'El apellido es requerido' });
        if (!fecha_nacimiento) return res.status(400).json({ message: 'La fecha de nacimiento es requerida' });
        if (!curp?.trim()) return res.status(400).json({ message: 'El CURP es requerido' });
        if (!rfc?.trim()) return res.status(400).json({ message: 'El RFC es requerido' });
        if (!domicilio?.trim()) return res.status(400).json({ message: 'El domicilio es requerido' });
        if (!celular?.trim()) return res.status(400).json({ message: 'El celular es requerido' });
        if (!email?.trim()) return res.status(400).json({ message: 'El email es requerido' });
        if (!anos_experiencia) return res.status(400).json({ message: 'Los años de experiencia son requeridos' });
        if (!contacto_nombre?.trim()) return res.status(400).json({ message: 'El nombre del contacto es requerido' });
        if (!contacto_parentesco?.trim()) return res.status(400).json({ message: 'El parentesco del contacto es requerido' });
        if (!contacto_telefono?.trim()) return res.status(400).json({ message: 'El teléfono del contacto es requerido' });
        if (!Array.isArray(especialidades) || especialidades.length === 0) {
            return res.status(400).json({ message: 'Debe seleccionar al menos una especialidad' });
        }

        const empleado = await Empleado.create({
            nombre,
            apellido,
            fecha_nacimiento,
            edad: edad || null,
            curp,
            rfc,
            domicilio,
            telefono_casa: telefono_casa || null,
            celular,
            email,
            anos_experiencia,
            contacto_nombre,
            contacto_parentesco,
            contacto_telefono,
            especialidades
        });

        res.status(201).json({ message: 'Empleado creado exitosamente', id: empleado.id });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear empleado',
            error: error.message
        });
    }
};

const getEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll();
        res.json(empleados);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al obtener empleados',
            error: error.message 
        });
    }
};

const deleteEmpleado = async (req, res) => {
    try {
        await Empleado.delete(req.params.id);
        res.json({ message: 'Empleado eliminado exitosamente' });
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al eliminar empleado',
            error: error.message 
        });
    }
};

const getEspecialidades = async (req, res) => {
    try {
        const especialidades = await Empleado.getEspecialidades();
        res.json(especialidades);
    } catch (error) {
        // Error
        res.status(500).json({ 
            message: 'Error al obtener especialidades',
            error: error.message 
        });
    }
};

export const empleadoController = {
    createEmpleado,
    getEmpleados,
    deleteEmpleado,
    getEspecialidades
};