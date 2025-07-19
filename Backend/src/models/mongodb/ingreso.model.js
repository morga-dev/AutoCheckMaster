import mongoose from 'mongoose';

const ingresoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    concepto: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Servicio', 'Producto']
    },
    cliente: {
        tipo: {
            type: String,
            required: true,
            enum: ['registrado', 'no_registrado']
        },
        id: {
            type: String,
            required: function() {
                return this.cliente.tipo === 'registrado';
            }
        },
        nombre: {
            type: String,
            required: function() {
                return this.cliente.tipo === 'no_registrado';
            }
        }
    },
    monto: {
        type: Number,
        required: true,
        min: 0
    },
    metodoPago: {
        type: String,
        required: true,
        enum: ['Efectivo', 'Tarjeta', 'Transferencia']
    },
    estado: {
        type: String,
        required: true,
        enum: ['Pendiente', 'Pagado'],
        default: 'Pendiente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Ingreso', ingresoSchema);