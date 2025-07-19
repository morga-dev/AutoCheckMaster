import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  nombre: String,
  rama: String,
  anioIncorporacion: String,
  sitioWeb: String,
  direccion: String,
  ciudad: String,
  estado: String,
  codigoPostal: String,
  telefono: String,
  logo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Empresa', empresaSchema);