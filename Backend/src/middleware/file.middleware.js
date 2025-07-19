import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const validatePdfFile = (req, res, next) => {
    if (!req.files || !req.files.pdf_orden) {
        return res.status(400).json({
            message: 'El archivo PDF es obligatorio',
            error: 'PDF_REQUIRED'
        });
    }

    const file = req.files.pdf_orden;

    // Verificar el tipo de archivo
    if (!file.mimetype.includes('pdf')) {
        return res.status(400).json({
            message: 'Formato de archivo no válido',
            error: 'Solo se permiten archivos PDF'
        });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return res.status(400).json({
            message: 'Archivo demasiado grande',
            error: 'El tamaño máximo permitido es 5MB'
        });
    }

    const fileName = `orden-${uuidv4()}${path.extname(file.name)}`;
    const uploadPath = path.join(process.cwd(), 'uploads', 'historial', fileName);

    // Mover el archivo
    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al guardar el archivo',
                error: err
            });
        }
        // Agregar la ruta del archivo al request para uso posterior
        req.pdfPath = `uploads/historial/${fileName}`;
        next();
    });
};