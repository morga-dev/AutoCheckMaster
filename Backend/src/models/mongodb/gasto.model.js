import mongoose from 'mongoose';

const gastoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        enum: [
            'Herramientas',
            'Nóminas',
            'Mantenimiento',
            'Servicios',
            'Materiales',
            'Gastos operativos',
            'Renta',
            'Servicios públicos',
            'Otros'
        ]
    },
    monto: {
        type: Number,
        required: true,
        min: 0
    },
    proveedor_registrado: {
        type: Boolean,
        required: true
    },
    proveedor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: function() {
            return this.proveedor_registrado === true;
        }
    },
    proveedor_nombre_manual: {
        type: String,
        required: function() {
            return this.proveedor_registrado === false;
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('Gasto', gastoSchema);