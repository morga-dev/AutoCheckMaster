import mongoose from 'mongoose';

const perfilSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    puesto: {
        type: String,
        required: true
    },
    fechaIngreso: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
    }
}, {
    timestamps: true,
    collection: 'perfiles'
});

export default mongoose.model('Perfil', perfilSchema);