import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema({
    // Información General
    nombreEmpresa: {
        type: String,
        required: true,
        trim: true
    },
    rfc: {
        type: String,
        required: true,
        trim: true
    },
    telefonoContacto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    nombreContacto: {
        type: String,
        required: true,
        trim: true
    },
    puestoContacto: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Refacciones', 'Herramientas', 'Servicios', 'Otros']
    },
    estatus: {
        type: String,
        default: 'Activo',
        enum: ['Activo', 'Inactivo']
    },
    historialCompras: [{

        fechaCompra: {
            default: Date.now,
            type: Date,
            required: true
        },
        productoServicio: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 0
        },
        costoTotal: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'proveedores'
});

export default mongoose.model('Proveedor', proveedorSchema);