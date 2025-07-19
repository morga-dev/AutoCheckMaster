import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pool } from './config/db.config.js';
import connectDB from './config/mongodb.config.js';
import authMiddleware from './middleware/auth.middleware.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

// Rutas de PostgreSQL
import authRoutes from './routes/postgres/auth.routes.js';
import clienteRoutes from './routes/postgres/cliente.routes.js';
import servicioRoutes from './routes/postgres/servicio.routes.js';
import empleadoRoutes from './routes/postgres/empleado.routes.js';
import ordenRoutes from './routes/postgres/orden.routes.js';
import citaRoutes from './routes/postgres/cita.routes.js';
import historialRoutes from './routes/postgres/historial.routes.js';

// Rutas de MongoDB
import gastoRoutes from './routes/mongodb/gasto.routes.js';
import ingresoRoutes from './routes/mongodb/ingreso.routes.js';
import refaccionRoutes from './routes/mongodb/refaccion.routes.js';
import proveedorRoutes from './routes/mongodb/proveedor.routes.js';
import perfilRoutes from './routes/mongodb/perfil.routes.js';
import empresaRoutes from './routes/mongodb/empresa.routes.js';

// Ruta de evidencias
import evidenciaRoutes from './routes/evidencias/evidencia.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorios necesarios
const setupDirectories = async () => {
    try {
        await mkdir(path.join(__dirname, '../uploads'), { recursive: true });
        await mkdir(path.join(__dirname, '../uploads/ordenes'), { recursive: true });
        await mkdir(path.join(__dirname, '../uploads/historial'), { recursive: true });
        await mkdir(path.join(__dirname, '../tmp'), { recursive: true });
    } catch (error) {
        console.error('Error creando directorios:', error);
    }
};

const app = express();

// Configuración CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON y URL
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para manejar archivos subidos
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../tmp'),
    preserveExtension: true,
    uploadTimeout: 60000,
    parseNested: true,
}));

// Middleware para archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Auth routes (sin middleware)
app.use('/api/auth', authRoutes);

// Middleware de autenticación
app.use('/api', authMiddleware);

// Protected routes
app.use('/api', clienteRoutes);
app.use('/api', servicioRoutes);
app.use('/api', historialRoutes);
app.use('/api', gastoRoutes);
app.use('/api', ingresoRoutes);
app.use('/api', refaccionRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', empleadoRoutes);
app.use('/api', ordenRoutes);
app.use('/api', citaRoutes);
app.use('/api', perfilRoutes);
app.use('/api', empresaRoutes);
app.use('/api/evidencias', evidenciaRoutes);

const startServer = async () => {
    try {
        await setupDirectories();
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en puerto ${PORT}`);
            console.log(`Bases de datos conectadas`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;


startServer();