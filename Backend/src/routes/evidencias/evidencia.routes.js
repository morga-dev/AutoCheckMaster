import express from 'express';
import path from 'path';

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const file = req.files.file;
    // Solo permitir imágenes
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Solo se permiten imágenes' });
    }

    // Nombre único para evitar colisiones
    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(process.cwd(), 'uploads', 'evidencias', fileName);

    await file.mv(uploadPath);

    // URL pública (ajusta si tu dominio cambia)
    const url = `http://localhost:5000/uploads/evidencias/${fileName}`;

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la evidencia', error: error.message });
  }
});

export default router;