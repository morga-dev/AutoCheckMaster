import mongoose from 'mongoose';

const refaccionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'refacciones' // Especificamos el nombre exacto de la colección
});

export default mongoose.model('Refaccion', refaccionSchema);